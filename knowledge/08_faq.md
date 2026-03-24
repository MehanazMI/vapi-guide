# Frequently Asked Questions

## Getting started

**Q: Is Vapi free to try?**
Yes. You get $10 in free credits when you sign up at dashboard.vapi.ai — no credit card required. This is enough for several hours of testing.

**Q: What do I need to build my first voice agent?**
Just a Vapi account and your API keys. For browser-based calls, copy the HTML script tag and you're live in minutes. No servers, no phone numbers required for web calls.

**Q: Where do I get my API keys?**
Log into dashboard.vapi.ai, go to your profile or the API Keys section. You'll find both your Private key (for server-side use) and Public key (for the browser SDK).

**Q: What's the difference between the public and private API key?**
The private key can create and manage assistants — keep it secret, server-side only. The public key is used in the browser via the Web SDK and is safe to expose in client-side code.

## Assistants and configuration

**Q: How do I make my assistant sound more natural?**
Use Cartesia Sonic-3 for TTS, enable backchannel responses, and keep system prompts concise. Tell the assistant to use short, spoken-English responses — avoid lists and markdown.

**Q: Can I change the voice mid-call?**
No — the voice is set per assistant. To use different voices in one call, use a Squad with different voice configurations.

**Q: How do I make the assistant end a call automatically?**
Add endCallPhrases to the assistant config (e.g. "goodbye", "thank you bye") or use the End Call tool in a function.

**Q: What's the maximum call length?**
Configurable via `maxDurationSeconds`. Default is 600 seconds (10 minutes). You can extend or shorten this.

## Tools and webhooks

**Q: My tool call times out — what do I do?**
Your server must respond within 20 seconds. For slow operations, respond immediately with a placeholder and use streaming or follow-up messages. Make sure your server is publicly accessible (use ngrok for local dev).

**Q: Can I test my webhook without a live call?**
Yes — send a POST request directly to your `/webhook` endpoint with the tool-calls payload format. Test with curl or a REST client.

**Q: How do I pass data between tool calls in the same conversation?**
The LLM maintains context across the full conversation. Results from previous tool calls appear in the message history automatically, so the LLM can reference earlier tool outputs.

## Voice and latency

**Q: What latency should I expect end-to-end?**
With Cartesia Sonic-3 + Deepgram nova-3 + GPT-4.1, typical end-to-end latency is 400–600ms. Cartesia's first-byte latency alone is ~40ms.

**Q: Why does my assistant sound choppy or robotic?**
Usually caused by: long LLM responses (keep system prompts instructing short answers), slow internet, or suboptimal TTS provider choice. Switch to Cartesia Sonic-3 if using another provider.

**Q: Does Vapi support languages other than English?**
Yes — Deepgram supports 30+ languages, Cartesia supports 40+ languages. Set `language` in the transcriber config and use a voice/model that matches your target language.

## Pricing and limits

**Q: How is Vapi priced?**
Pay per minute of call usage. Pricing varies by the providers you choose (TTS, STT, LLM). Check current rates at vapi.ai/pricing.

**Q: Is there a rate limit on calls?**
The default plan allows up to 10 concurrent calls. Enterprise plans support higher concurrency.

**Q: Does Vapi support HIPAA compliance?**
Yes — Vapi offers a BAA (Business Associate Agreement) for healthcare use cases. Contact Vapi's sales team for HIPAA-compliant plan details.

## Common errors

**Q: "Assistant not found" error**
Double-check the assistant ID in your frontend. Make sure you're using the full ID returned when you created the assistant.

**Q: The call connects but I hear nothing**
Check your browser microphone permissions. Try in Chrome, which has the best WebRTC support. Check the browser console for errors.

**Q: My webhook returns 200 but the tool call fails**
Make sure your response body is exactly: `{"results": [{"toolCallId": "...", "result": "..."}]}`. The `toolCallId` must match the ID from the incoming request exactly.
