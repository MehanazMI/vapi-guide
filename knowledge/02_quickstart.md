# Quickstart — Build Your First Voice Agent

## Step 1: Create a Vapi account

Go to https://dashboard.vapi.ai and sign up. You receive $10 in free credits automatically — no credit card required.

## Step 2: Get your API keys

1. Log in to https://dashboard.vapi.ai
2. Navigate to your profile or the API Keys section
3. Copy your **Private API Key** — used for server-side operations and setup scripts
4. Copy your **Public API Key** — used in the browser with the Web SDK

## Step 3: Create your first assistant

**Option A — Dashboard (no code):**
1. Go to Build > Assistants and click Create Assistant
2. Give it a name and a first message
3. Write a system prompt describing your agent's role
4. Select a voice (Cartesia Sonic-3 is recommended for best quality)
5. Click Save — your assistant is live immediately

**Option B — Python (one API call):**
```python
import requests

response = requests.post(
    "https://api.vapi.ai/assistant",
    headers={"Authorization": "Bearer YOUR_PRIVATE_KEY"},
    json={
        "name": "My First Assistant",
        "firstMessage": "Hello! How can I help you today?",
        "model": {
            "provider": "openai",
            "model": "gpt-4.1",
            "messages": [{"role": "system", "content": "You are a helpful assistant. Keep responses concise."}]
        },
        "voice": {
            "provider": "cartesia",
            "voiceId": "248be419-c632-4f23-adf1-5324ed7dbf1d"
        },
        "transcriber": {"provider": "deepgram", "model": "nova-3", "language": "en"}
    }
)
assistant_id = response.json()["id"]
print(f"Assistant created: {assistant_id}")
```

## Step 4: Talk to your assistant in the browser

Add this HTML snippet to any page to get a clickable call button instantly:
```html
<script>
  (function(d, t) {
    var g = document.createElement(t), s = d.getElementsByTagName(t)[0];
    g.src = "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
    g.defer = true; g.async = true;
    s.parentNode.insertBefore(g, s);
    g.onload = function() {
      window.vapiSDK.run({
        apiKey: "YOUR_PUBLIC_KEY",
        assistant: "YOUR_ASSISTANT_ID"
      });
    };
  })(document, "script");
</script>
```

## Step 5: Test via phone call

1. Go to Build > Phone Numbers in the dashboard
2. Buy a Vapi number or import your own from Twilio/Vonage
3. Attach your assistant to that number
4. Call the number — your assistant answers!

## What to build next

- Add tools so your agent can call external APIs
- Set up a webhook server to handle tool calls
- Upload a knowledge base for intelligent document retrieval
- Use Squads to chain multiple specialized assistants
