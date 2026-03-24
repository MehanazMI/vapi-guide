# What is Vapi?

Vapi is the developer platform for building voice AI agents. It handles all the complex infrastructure so you can focus on your product.

## How it works

Every Vapi call combines three technologies in sequence:
1. **Speech-to-Text (STT)**: Converts user speech into text. Default: Deepgram nova-3.
2. **Large Language Model (LLM)**: Processes the conversation and generates a response. Default: GPT-4o.
3. **Text-to-Speech (TTS)**: Converts the response back into natural speech. Default: Cartesia Sonic-3.

## Two ways to build

- **Assistants**: Single system prompt + tools + structured outputs. Best for most use cases — customer support, scheduling, onboarding.
- **Squads**: Multiple specialized assistants with context-preserving transfers. Best for complex workflows.

## Key capabilities

- Sub-600ms response times with natural turn-taking
- Web calls via WebRTC (browser-based, no phone needed)
- Phone calls via PSTN (inbound and outbound)
- Tool calling — connect your APIs and databases
- Knowledge Bases — upload files for semantic retrieval (RAG)
- Multi-assistant orchestration via Squads

## Pricing

- Free tier: $10 in free credits when you sign up — no credit card required
- Pay-as-you-go after that, billed per minute of call usage
- Full pricing details at: https://vapi.ai/pricing

## API Base URL

All REST API calls go to: `https://api.vapi.ai`
Authentication: `Authorization: Bearer YOUR_PRIVATE_API_KEY`
Dashboard: https://dashboard.vapi.ai
