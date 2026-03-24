// app.js — VapiGuide AI Frontend
// Vapi Web SDK integration: call control, transcript, orb, chips

// ---------------------------------------------------------------------------
// Config — update these after running scripts/setup_assistant.py
// ---------------------------------------------------------------------------
const VAPI_PUBLIC_KEY  = "fb3dac03-f0ee-4b77-8bd6-3f069f5e5774";
const ASSISTANT_ID     = "95da9243-2a6a-4a02-96e1-0af8ed97d456";

// ---------------------------------------------------------------------------
// UI Elements
// ---------------------------------------------------------------------------
const orbContainer  = document.getElementById("orb-container");
const callBtn       = document.getElementById("call-btn");
const endBtn        = document.getElementById("end-btn");
const statusLabel   = document.getElementById("status-label");
const transcriptBox = document.getElementById("transcript-box");
const clearBtn      = document.getElementById("clear-btn");
const toolLog       = document.getElementById("tool-log");
const chips         = document.querySelectorAll(".chip");

// Stats
const statCalls     = document.getElementById("stat-calls");
const statDuration  = document.getElementById("stat-duration");

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
let vapi         = null;
let callActive   = false;
let callCount    = 0;
let callStart    = null;
let timerInterval= null;
let pendingChip  = null;  // chip text to send once call starts

// ---------------------------------------------------------------------------
// Vapi SDK Loader (CDN)
// ---------------------------------------------------------------------------
function loadVapiSDK() {
  return new Promise((resolve) => {
    if (window.Vapi) { resolve(); return; }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@vapi-ai/web@latest/dist/vapi.umd.js";
    script.onload = resolve;
    document.head.appendChild(script);
  });
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
async function init() {
  await loadVapiSDK();

  if (!ASSISTANT_ID) {
    setStatus("⚠ Run setup_assistant.py first, then paste the ID in app.js", "error");
    callBtn.disabled = true;
    return;
  }

  vapi = new window.Vapi(VAPI_PUBLIC_KEY);
  bindEvents();
  setStatus("Ready — click to start", "idle");
}

// ---------------------------------------------------------------------------
// Event Bindings
// ---------------------------------------------------------------------------
function bindEvents() {
  vapi.on("call-start", onCallStart);
  vapi.on("call-end",   onCallEnd);
  vapi.on("speech-start", () => setOrbState("speaking"));
  vapi.on("speech-end",   () => setOrbState("active"));
  vapi.on("volume-level", onVolume);
  vapi.on("message",  onMessage);
  vapi.on("error",    onError);
}

// ---------------------------------------------------------------------------
// Call control
// ---------------------------------------------------------------------------
callBtn.addEventListener("click", async () => {
  if (!vapi) return;
  callBtn.disabled = true;
  setStatus("Connecting…", "connecting");
  setOrbState("connecting");
  try {
    await vapi.start(ASSISTANT_ID);
  } catch (e) {
    onError(e);
  }
});

endBtn.addEventListener("click", () => {
  if (vapi && callActive) vapi.stop();
});

function onCallStart() {
  callActive = true;
  callCount++;
  callStart  = Date.now();
  statCalls.textContent = callCount;

  callBtn.style.display = "none";
  endBtn.style.display  = "flex";
  setOrbState("active");
  setStatus("Live — Sage is ready", "active");
  startTimer();

  // Send pending chip
  if (pendingChip) {
    setTimeout(() => {
      vapi.send({ type: "add-message", message: { role: "user", content: pendingChip } });
      pendingChip = null;
    }, 600);
  }
}

function onCallEnd() {
  callActive = false;
  callBtn.disabled = false;
  callBtn.style.display = "flex";
  endBtn.style.display  = "none";
  setOrbState("idle");
  setStatus("Call ended — click to talk again", "idle");
  stopTimer();
  addSystemMessage("Call ended");
}

// ---------------------------------------------------------------------------
// Messages / Transcript
// ---------------------------------------------------------------------------
function onMessage(msg) {
  if (msg.type === "transcript" && msg.transcriptType === "final") {
    addTranscriptBubble(msg.role, msg.transcript);
  }
  if (msg.type === "tool-calls") {
    const calls = msg.toolCallList || [];
    calls.forEach(c => addToolEntry(c.name, c.arguments));
  }
  if (msg.type === "tool-call-result") {
    // Optionally show result
  }
}

function addTranscriptBubble(role, text) {
  removeEmptyState();
  const wrap = document.createElement("div");
  wrap.className = `msg ${role === "user" ? "user" : "assistant"}`;

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  if (role === "user") {
    avatar.textContent = "🧑";
  } else {
    avatar.innerHTML = `<img src="sage.png" alt="Sage" style="width:100%;height:100%;object-fit:cover;object-position:top center;border-radius:50%;" />`;
  }

  const inner = document.createElement("div");
  inner.style.display = "flex";
  inner.style.flexDirection = "column";
  inner.style.gap = "2px";

  const label = document.createElement("div");
  label.className = "role-label";
  label.textContent = role === "user" ? "You" : "Sage";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  inner.appendChild(label);
  inner.appendChild(bubble);
  wrap.appendChild(avatar);
  wrap.appendChild(inner);
  transcriptBox.appendChild(wrap);
  transcriptBox.scrollTop = transcriptBox.scrollHeight;
}

function addSystemMessage(text) {
  const div = document.createElement("div");
  div.style.cssText = "text-align:center;font-size:0.72rem;color:var(--text-muted);padding:4px 0;";
  div.textContent = `— ${text} —`;
  transcriptBox.appendChild(div);
  transcriptBox.scrollTop = transcriptBox.scrollHeight;
}

function removeEmptyState() {
  const empty = transcriptBox.querySelector(".empty-state");
  if (empty) empty.remove();
}

// ---------------------------------------------------------------------------
// Tool log
// ---------------------------------------------------------------------------
function addToolEntry(name, args) {
  const noTools = toolLog.querySelector(".no-tools");
  if (noTools) noTools.remove();

  const entry = document.createElement("div");
  entry.className = "tool-entry";
  entry.innerHTML = `
    <span class="icon">⚡</span>
    <div>
      <div class="name">${name}</div>
      <div class="args">${JSON.stringify(args)}</div>
    </div>`;
  toolLog.appendChild(entry);
  toolLog.scrollTop = toolLog.scrollHeight;
}

// ---------------------------------------------------------------------------
// Quick-question chips
// ---------------------------------------------------------------------------
chips.forEach(chip => {
  chip.addEventListener("click", () => {
    const text = chip.dataset.question;
    if (!callActive) {
      pendingChip = text;
      callBtn.click();
    } else {
      vapi.send({ type: "add-message", message: { role: "user", content: text } });
      addTranscriptBubble("user", text);
    }
  });
});

// ---------------------------------------------------------------------------
// Clear transcript
// ---------------------------------------------------------------------------
clearBtn.addEventListener("click", () => {
  transcriptBox.innerHTML = `
    <div class="empty-state">
      <div class="icon">🎙️</div>
      <p>Your conversation with Sage will appear here</p>
    </div>`;
  toolLog.innerHTML = `<div class="no-tools">Tool calls will appear here during the conversation</div>`;
});

// ---------------------------------------------------------------------------
// Orb states
// ---------------------------------------------------------------------------
function setOrbState(state) {
  orbContainer.className = "orb-container " + state;
}

function onVolume(level) {
  // subtle orb scale on volume
  const orb = orbContainer.querySelector(".orb");
  if (orb && callActive) {
    const scale = 1 + level * 0.12;
    orb.style.transform = `scale(${scale})`;
  }
}

// ---------------------------------------------------------------------------
// Status label
// ---------------------------------------------------------------------------
function setStatus(text, cls = "idle") {
  statusLabel.textContent = text;
  statusLabel.className = cls;
}

// ---------------------------------------------------------------------------
// Timer
// ---------------------------------------------------------------------------
function startTimer() {
  timerInterval = setInterval(() => {
    const secs = Math.floor((Date.now() - callStart) / 1000);
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    statDuration.textContent = `${m}:${s}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

// ---------------------------------------------------------------------------
// Error handler
// ---------------------------------------------------------------------------
function onError(err) {
  console.error("Vapi error:", err);
  callBtn.disabled = false;
  callBtn.style.display = "flex";
  endBtn.style.display = "none";
  setOrbState("idle");
  setStatus("Connection error — try again", "error");
  stopTimer();
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
init();
