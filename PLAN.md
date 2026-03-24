# VapiGuide AI — Implementation Plan
### *"Vapi, explained by Vapi"*

---

## Overview

VapiGuide AI is a voice-first developer assistant that helps new users onboard to Vapi through natural conversation. It is itself built with Vapi — making it a live demonstration of the platform's capabilities.

---

## Phases

### Phase 1 — Demo (in progress)
**Goal:** A beautiful, working voice agent that can answer Vapi questions.
**Requirements:** Vapi account + public API key. No backend server or ngrok needed.

| # | Deliverable | Status |
|---|---|---|
| 1 | `agents.md` — agent design doc | ✅ Done |
| 2 | `PLAN.md` — this file | ✅ Done |
| 3 | `knowledge/*.md` — 8 KB files | 🔄 In progress |
| 4 | `scripts/setup_assistant.py` — create Sage on Vapi | ⬜ Todo |
| 5 | `frontend/index.html` + `style.css` + `app.js` — web UI | ⬜ Todo |
| 6 | `README.md` — setup guide | ⬜ Todo |

### Phase 2 — Full Stack
**Goal:** Add live tool calls for dynamic code examples and status checks.
**Requirements:** FastAPI server exposed via ngrok.

| # | Deliverable |
|---|---|
| 1 | `backend/main.py` — FastAPI webhook handler |
| 2 | `backend/tools.py` — code snippets store + status check |
| 3 | Update `setup_assistant.py` to add tool definitions |

---

## Architecture (Phase 1)

```
Browser
  │ WebRTC (Vapi Web SDK)
  ▼
Vapi Platform
  ├── STT: Deepgram nova-3
  ├── LLM: GPT-4.1 + Knowledge Base (RAG over 8 .md files)
  └── TTS: Cartesia Sonic-3 (~40ms)
```

---

## Knowledge Base Files

| File | Topics covered |
|---|---|
| `01_what_is_vapi.md` | What Vapi is, pipeline, free tier, pricing |
| `02_quickstart.md` | Account → key → assistant → first call |
| `03_tools_and_webhooks.md` | Function tools, webhook format, ngrok |
| `04_voice_and_models.md` | Cartesia, ElevenLabs, Deepgram, LLMs |
| `05_web_sdk.md` | npm install, events, HTML script tag |
| `06_phone_numbers.md` | Buy number, inbound/outbound |
| `07_squads.md` | Multi-assistant orchestration |
| `08_faq.md` | Top 20 beginner questions |

---

## Agent Config (Sage)

```json
{
  "name": "VapiGuide AI — Sage",
  "firstMessage": "Hey! I'm Sage — your voice guide to Vapi. Ask me anything about building voice agents — getting started, code examples, pricing. I've got you.",
  "model": {
    "provider": "openai",
    "model": "gpt-4.1",
    "temperature": 0.3
  },
  "voice": {
    "provider": "cartesia",
    "voiceId": "248be419-c632-4f23-adf1-5324ed7dbf1d"
  },
  "transcriber": {
    "provider": "deepgram",
    "model": "nova-3",
    "language": "en"
  },
  "backchannelingEnabled": true,
  "backgroundDenoisingEnabled": true
}
```

---

## Frontend UI Features

- **Animated voice orb** — pulses when Sage is speaking
- **Live transcript** — user and agent messages in real time
- **Quick-question chips** — one-tap prompts to start the conversation:
  - *"How do I create my first assistant?"*
  - *"What voices does Cartesia Sonic support?"*
  - *"What's the pricing?"*
  - *"How do I add a tool to my assistant?"*
  - *"Show me the Web SDK quickstart"*
- **Call status bar** — idle → connecting → active → ended

---

## Setup (Phase 1 — 2 commands)

```bash
# 1. Install Python deps
pip install requests python-dotenv

# 2. Create Sage on Vapi and upload knowledge base
python scripts/setup_assistant.py

# 3. Open frontend in browser — no server needed
open frontend/index.html
```

---

## Demo Script (5 min)

| Time | Action |
|---|---|
| 0:00 | Pitch: *"New devs read docs for hours. We made them talk instead."* |
| 0:40 | Open browser → show glowing UI |
| 1:10 | *"What is Vapi and how does it work?"* |
| 2:00 | *"How do I create my first assistant?"* |
| 2:50 | *"What voices does Cartesia Sonic support?"* |
| 3:30 | *"What's the pricing?"* |
| 4:10 | Show live transcript |
| 4:40 | Architecture → close |
