# VapiGuide AI 🎙️
### *"Vapi, explained by Vapi"*

A voice-first AI guide that helps new developers build with Vapi — through natural voice conversation, powered entirely by Vapi + Cartesia Sonic-3.

> Built at the **Vapi AI × Cartesia Hackathon** · March 24, 2026 · NYC

---

## What is this?

Talk to **Tuttu** — a voice AI agent that answers any question about Vapi, in real time, by voice. Ask about quickstarts, tools, webhooks, pricing, the Web SDK, and more. The meta twist: Tuttu is *built with Vapi*, making it a live demo of what it teaches.

## Setup (2 steps)

### Prerequisites
- Python 3.9+
- A Vapi account at [dashboard.vapi.ai](https://dashboard.vapi.ai) — $10 free credits on sign-up

### Step 1: Configure environment

```bash
cp .env.example .env
# Edit .env and add your Vapi API keys
```

| Variable | Where to find it |
|---|---|
| `VAPI_PRIVATE_KEY` | dashboard.vapi.ai → API Keys |
| `VAPI_PUBLIC_KEY` | dashboard.vapi.ai → API Keys |
| `CARTESIA_API_KEY` | play.cartesia.ai → API Keys (optional) |

### Step 2: Create Tuttu on Vapi

```bash
pip install requests python-dotenv
python scripts/setup_assistant.py
```

This will:
1. Upload all 8 knowledge base files to Vapi
2. Create the Tuttu assistant with RAG enabled
3. Print your `ASSISTANT_ID`

### Step 3: Open the frontend

Copy the `ASSISTANT_ID` printed by the setup script and paste it in `frontend/app.js`:
```js
const ASSISTANT_ID = "your-assistant-id-here";
```

Then open `frontend/index.html` directly in Chrome. No server needed!

---

## UTuttu

1. Open `frontend/index.html` in Chrome
2. Click **Talk to Tuttu**
3. Ask anything about Vapi — or tap a quick-question chip

**Example questions:**
- *"What is Vapi and how does it work?"*
- *"How do I create my first assistant?"*
- *"What voices does Cartesia Sonic support?"*
- *"How do I add a tool to my assistant?"*
- *"What's the pricing and free tier?"*

---

## Project Structure

```
vapi-guide/
├── agents.md                   ← Agent design document
├── PLAN.md                     ← Implementation plan
├── README.md                   ← This file
├── .env.example                ← Environment template
│
├── knowledge/                  ← Knowledge base (.md files uploaded to Vapi)
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
│   └── setup_assistant.py      ← Creates Tuttu on Vapi (run once)
│
└── frontend/
    ├── index.html              ← Web UI — open directly in browser
    ├── style.css               ← Dark Vapi-purple theme
    └── app.js                  ← Vapi Web SDK integration
```

---

## Architecture

```
Browser (Vapi Web SDK — WebRTC)
        │
        ▼
  VAPI PLATFORM
  ├── STT: Deepgram nova-3
  ├── LLM: GPT-4.1 + Knowledge Base (RAG over 8 .md files)
  └── TTS: Cartesia Sonic-3 (~40ms latency)
```

Vapi's native Knowledge Base feature handles all RAG automatically — no vector database, no embeddings pipeline.

---

## Phase 2 (coming)

- `backend/` — FastAPI webhook for live tool calls
  - `get_code_example(topic, language)` — Python / TypeScript / cURL snippets on demand
  - `get_vapi_status()` — live Vapi API health check
- Requires ngrok or a public server URL

---

## Tech Stack

| Layer | Technology |
|---|---|
| Voice infrastructure | [Vapi](https://vapi.ai) |
| Text-to-speech | [Cartesia Sonic-3](https://cartesia.ai) (~40ms) |
| Speech-to-text | Deepgram nova-3 |
| LLM | OpenAI GPT-4.1 |
| Frontend | HTML + CSS + Vanilla JS |
| Knowledge Base | Vapi native RAG (uploaded .md files) |
