# VapiGuide AI — System Architecture

> *"Vapi, explained by Vapi"* · Hackathon 2026 · Built with Vapi + Cartesia Sonic-3

---

## Architecture Diagram

```mermaid
flowchart TD
    subgraph Browser["🌐 Browser — Chrome (localhost:8000)"]
        direction TB
        UI["Frontend UI\nindex.html + style.css\nDark Vapi-purple theme\nGlassmorphism + micro-animations"]
        SDK["@vapi-ai/web SDK v2.5.2\nLoaded via esm.sh CDN\nWebRTC peer connection\nReal-time audio streaming"]
        MIC["🎤 Microphone\nWebRTC getUserMedia\nOpus codec, 48kHz"]
        SPK["🔊 Speaker\nWebRTC audio output\nLow-latency playback"]
        UI --> SDK
        SDK --> MIC
        SDK --> SPK
    end

    subgraph Vapi["⚡ Vapi Platform (api.vapi.ai)"]
        direction TB
        WS["WebRTC Gateway\nDailyco infrastructure\nICE / STUN / TURN"]

        subgraph STT["Speech-to-Text"]
            DG["Deepgram nova-3\nStreaming ASR\n~120ms latency\n30+ languages"]
        end

        subgraph LLM["Language Model"]
            GPT["OpenAI GPT-4.1\nTemp: 0.3\nMax context: 1M tokens\nStreaming tokens"]
            KB["Knowledge Base\nVapi native RAG\n6 curated .md files\nSemantic vector search\nauto-injected query tool"]
            GPT <--> KB
        end

        subgraph TTS["Text-to-Speech"]
            CAR["Cartesia Sonic-3\nDiego — Hype Guy voice\n~40ms TTFB\nStreaming PCM audio\nOpus encoding"]
        end

        WS --> STT --> LLM --> TTS --> WS
    end

    subgraph KB_Files["📚 Knowledge Base (Vapi Files API)"]
        F1["01_what_is_vapi.md\nVapi overview, STT/LLM/TTS pipeline"]
        F2["02_quickstart.md\nAccount → API key → first call"]
        F3["03_tools_and_webhooks.md\nFunction tools, FastAPI server"]
        F4["04_voice_and_models.md\nCartesia, ElevenLabs, Deepgram"]
        F5["05_web_sdk.md\nSDK events, WebRTC, React"]
        F6["06_phone_numbers.md\nBuy/import numbers, calls"]
        F7["07_squads.md\nMulti-assistant orchestration"]
        F8["08_faq.md\n20 beginner Q&As"]
    end

    subgraph GitHub["🐙 GitHub — MehanazMI/vapi-guide"]
        REPO["main branch\nfrontend/ · knowledge/\nscripts/ · .agents/skills/"]
    end

    MIC -->|"Opus audio\nWebRTC"| WS
    WS -->|"PCM audio\nWebRTC"| SPK
    KB_Files -->|"Uploaded via\nFiles API\nAuto-vectorized"| KB
    REPO -->|"Served by\npython -m http.server"| UI

    SDK -->|"Events: call-start\ntranscript · speech-start\ntool-calls · error"| UI
```

---

## Component Breakdown

| Layer | Technology | Config | Latency |
|---|---|---|---|
| **Frontend** | HTML + CSS + Vanilla JS | Glassmorphism dark theme, esm.sh SDK | n/a |
| **WebRTC Transport** | Vapi ↔ Daily.co | ICE/STUN/TURN negotiation | ~20ms network |
| **STT** | Deepgram nova-3 | Streaming ASR, language=en | ~120ms |
| **LLM** | OpenAI GPT-4.1 | temp=0.3, streaming | ~200–400ms TTFT |
| **RAG** | Vapi native KB | 6 .md files, semantic query tool | +50ms injected into LLM |
| **TTS** | Cartesia Sonic-3 | Diego voice, streaming PCM | ~40ms TTFB |
| **Total E2E** | — | — | **~400–600ms** |

---

## Data Flow (per turn)

```
1. User speaks       → WebRTC Opus audio → Vapi gateway
2. Vapi gateway      → Deepgram nova-3  → streaming text transcript
3. Transcript event  → Browser SDK      → show user bubble in UI
4. Deepgram final    → GPT-4.1 prompt   → (system prompt + history + KB context)
5. KB tool fires     → semantic search over 6 .md files → injected as context
6. GPT-4.1 streams   → Cartesia Sonic-3 → streaming audio starts at first token
7. Cartesia audio    → WebRTC playback  → user hears Tuttu speak
8. speech-start evt  → Browser SDK      → orb glows teal + breathe animation
9. transcript event  → Browser SDK      → show Tuttu bubble in UI
```

---

## Knowledge Base (RAG) Technical Details

Vapi's native KB uses **semantic vector search**. No external vector database is needed.

| Step | Detail |
|---|---|
| **Ingestion** | Files uploaded via `POST /file` (multipart) |
| **Vectorization** | Vapi auto-chunks and embeds on upload |
| **Retrieval** | Auto-injected `query(input)` function tool |
| **Trigger** | GPT-4.1 calls the tool when context is needed |
| **Response** | Top-k semantically similar chunks injected into LLM context |
| **Files** | 6 × `.md` files (01–08, 2 blocked by Cloudflare during upload) |

---

## Phase 2 — Planned Tool Server

```mermaid
flowchart LR
    VAPI["Vapi Platform"] -->|"POST /webhook\ntool-calls payload"| FW["FastAPI Server\n(localhost:8000 → ngrok)"]
    FW --> GCE["get_code_example\ntopic · language"]
    FW --> GVS["get_vapi_status\nLive API health check"]
    GCE -->|"tool result"| VAPI
    GVS -->|"tool result"| VAPI
```

| Tool | Input | Output |
|---|---|---|
| `get_code_example(topic, language)` | e.g. `"create assistant", "python"` | Full boilerplate code snippet |
| `get_vapi_status()` | none | Live Vapi API health JSON |

---

## Security Model

| Key | Exposure | Used Where |
|---|---|---|
| **Public API Key** | Exposed in `app.js` (safe by design) | Browser → Vapi SDK |
| **Private API Key** | In `.env` only (gitignored) | `setup_assistant.py` server-side only |
| **Cartesia Key** | In `.env` only (gitignored) | Phase 2 tool server only |

---

> **Assistant ID:** `95da9243-2a6a-4a02-96e1-0af8ed97d456`  
> **Public Key:** `fb3dac03-f0ee-4b77-8bd6-3f069f5e5774`  
> **Voice:** Cartesia Sonic-3 · Diego (Hype Guy) · `399002e9-7f7d-42d4-a6a8-9b91bd809b9d`  
> **KB Files:** 6 uploaded · assistant ID wired in frontend
