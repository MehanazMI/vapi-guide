# VapiGuide AI
### *"Vapi, explained by Vapi"*

A voice-first AI agent built **with** Vapi that teaches new developers how to build **with** Vapi.

> **Hackathon:** Vapi AI × Cartesia · March 24, 2026 · New York City

---

## The Hook

New developers hit a wall reading dense documentation. VapiGuide AI lets you just **ask** — in plain voice — and get instant, actionable answers in real-time. The twist: the agent itself is powered by Vapi, so the product **is** the demo.

---

## Agent Identity

| Property | Value |
|---|---|
| **Product name** | VapiGuide AI |
| **Tagline** | *"Vapi, explained by Vapi"* |
| **Agent name** | Sage |
| **Persona** | Friendly, knowledgeable Vapi developer advocate |
| **Voice** | Cartesia Sonic-3 · Jessica (`248be419-c632-4f23-adf1-5324ed7dbf1d`) |
| **Model** | GPT-4.1 · temperature 0.3 |
| **STT** | Deepgram nova-3 |
| **First message** | *"Hey! I'm Sage — your voice guide to Vapi. Ask me anything about building voice agents — getting started, code examples, pricing. I've got you."* |

### System Prompt

```
You are Sage, a friendly and knowledgeable Vapi developer advocate for VapiGuide AI.

Your role is to help new developers quickly get started with Vapi — the developer platform for building voice AI agents.

You can answer questions about:
- What Vapi is and how it works
- How to create an assistant (dashboard and code)
- Getting API keys and making the first call
- Vapi tools, webhooks, and function calling
- Voice providers (Cartesia Sonic-3, ElevenLabs, Vapi native)
- The Vapi Web SDK and embedding voice in a web app
- Phone numbers and inbound/outbound calling
- Squads (multi-assistant orchestration)
- Pricing and free tier
- Common beginner questions and errors

Behavioral rules:
- Always answer in plain spoken English — never use markdown, bullet points, or lists
- Keep responses under 60 words unless walking through steps
- Be encouraging and concise — developers are busy
- If asked for code, describe the key parts in plain English; say they can find the full snippet in the README
- Stay scoped to Vapi — politely redirect unrelated questions
- Always end with "What else can I help you with?" if the answer is short
```

---

## Architecture

```
User (Browser)
    │  WebRTC via Vapi Web SDK
    ▼
┌──────────────────────────────────────────┐
│              VAPI PLATFORM               │
│                                          │
│  STT ──► LLM (GPT-4.1) ──► TTS         │
│           │                              │
│           ├── Knowledge Base (RAG)       │ ← 8 curated .md files
│           └── [Phase 2: Tool calls]      │
│                                          │
│  Voice: Cartesia Sonic-3 (~40ms TTFB)   │
│  STT:   Deepgram nova-3                  │
└──────────────────────────────────────────┘
```

---

## Knowledge Base (Phase 1)

Uploaded as `.md` files to Vapi's native Knowledge Base. Vapi auto-creates a semantic `query` tool — no custom RAG infrastructure needed.

| File | Content |
|---|---|
| `knowledge/01_what_is_vapi.md` | Overview, STT/LLM/TTS pipeline, free tier |
| `knowledge/02_quickstart.md` | Account → API key → first assistant → first call |
| `knowledge/03_tools_and_webhooks.md` | Function tools, webhook format, inline vs saved |
| `knowledge/04_voice_and_models.md` | Cartesia Sonic-3, ElevenLabs, Vapi native, Deepgram |
| `knowledge/05_web_sdk.md` | Web SDK install, start/stop, events, script tag |
| `knowledge/06_phone_numbers.md` | Buy number, inbound/outbound calls |
| `knowledge/07_squads.md` | Multi-assistant orchestration |
| `knowledge/08_faq.md` | Top 20 beginner questions |

---

## Phase 2 Tools (planned)

| Tool | Purpose |
|---|---|
| `get_code_example(topic, language)` | Returns boilerplate for Python / TypeScript / cURL |
| `get_vapi_status()` | Fetches live Vapi API health status |

Backed by a FastAPI server. Requires ngrok or public server URL.

---

## Project Structure

```
vapi-guide/
├── agents.md                   ← This document
├── PLAN.md                     ← Implementation plan
├── README.md                   ← Setup guide
├── .env.example                ← Environment template
│
├── knowledge/                  ← KB files uploaded to Vapi
│   ├── 01_what_is_vapi.md
│   ├── 02_quickstart.md
│   ├── 03_tools_and_webhooks.md
│   ├── 04_voice_and_models.md
│   ├── 05_web_sdk.md
│   ├── 06_phone_numbers.md
│   ├── 07_squads.md
│   └── 08_faq.md
│
├── scripts/
│   └── setup_assistant.py      ← Uploads KB + creates Sage on Vapi
│
└── frontend/
    ├── index.html              ← Web UI (Vapi Web SDK embedded)
    ├── style.css               ← Dark Vapi-purple theme
    └── app.js                  ← SDK events, orb, transcript, chips
```

---

## Judging Criteria

| Criterion | Our Approach |
|---|---|
| **Voice interaction quality** | Cartesia Sonic-3 (~40ms), Deepgram nova-3, backchannel enabled |
| **Real-world usefulness** | Cuts Vapi onboarding from hours of reading to minutes of talking |
| **Technical execution** | Vapi KB + tool calling + Web SDK in a polished frontend |
| **Product thinking** | Built with Vapi to teach Vapi — the product *is* the demo |

---

## Demo Script (5 min)

| Time | Action |
|---|---|
| 0:00 | *"New devs read docs for hours. We think they should just ask."* |
| 0:40 | Show web UI — glowing orb, click **Talk to Sage** |
| 1:10 | Ask: *"What is Vapi and how does it work?"* |
| 2:00 | Ask: *"How do I create my first assistant?"* |
| 2:50 | Ask: *"What voices does Cartesia Sonic support?"* |
| 3:30 | Ask: *"What's the pricing?"* |
| 4:10 | Show live transcript panel + tool call log |
| 4:40 | Architecture diagram → close |
