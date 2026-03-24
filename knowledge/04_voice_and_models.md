# Voice Providers and Models

Vapi gives you full control over the STT, LLM, and TTS components of every call.

## Text-to-Speech (TTS) Providers

### Cartesia Sonic-3 (Recommended)
- Industry-leading ~40ms time-to-first-byte latency
- Highly natural, emotional, expressive voices
- Native integration with Vapi — no separate API key needed
- Supports 40+ languages
- Best Jessica voice ID: `248be419-c632-4f23-adf1-5324ed7dbf1d`

```json
"voice": {
  "provider": "cartesia",
  "voiceId": "248be419-c632-4f23-adf1-5324ed7dbf1d"
}
```

### ElevenLabs
- High-quality voice cloning and custom voices
- Slightly higher latency than Cartesia
- Best for brand voices and character-based agents

```json
"voice": {
  "provider": "11labs",
  "voiceId": "your-elevenlabs-voice-id"
}
```

### Vapi Native Voices
- Built-in voices, no external provider account needed
- Good quality, reliable fallback option
- Example: Elliot, Jennifer, etc.

```json
"voice": {
  "provider": "vapi",
  "voiceId": "Elliot"
}
```

### OpenAI TTS
```json
"voice": {
  "provider": "openai",
  "voiceId": "alloy"
}
```

## Speech-to-Text (STT) Providers

### Deepgram nova-3 (Recommended)
- Best accuracy for conversational speech
- Very low latency
- Supports 30+ languages

```json
"transcriber": {
  "provider": "deepgram",
  "model": "nova-3",
  "language": "en"
}
```

### Other STT options
- `gladia` — great for multilingual transcription
- `assembly-ai` — strong accuracy, good punctuation
- `openai` (Whisper) — solid general purpose

## LLM Providers

Vapi supports all major LLM providers:

| Provider | Models |
|---|---|
| OpenAI | `gpt-4.1`, `gpt-4o`, `gpt-4o-mini`, `gpt-3.5-turbo` |
| Anthropic | `claude-3-5-sonnet`, `claude-3-haiku` |
| Google | `gemini-1.5-pro`, `gemini-1.5-flash` |
| Meta | `llama-3.1-70b`, `llama-3.1-8b` |
| Groq | Fastest inference, great for low latency |

```json
"model": {
  "provider": "openai",
  "model": "gpt-4.1",
  "temperature": 0.3,
  "messages": [{"role": "system", "content": "Your system prompt here"}]
}
```

## Combining providers for best results

Optimal combination for voice quality + speed:
- STT: Deepgram nova-3
- LLM: GPT-4.1 (temperature 0.3 for consistency)
- TTS: Cartesia Sonic-3

This setup achieves sub-600ms total response latency for natural conversations.
