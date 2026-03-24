# Vapi Web SDK

The Vapi Web SDK lets you embed voice AI directly in any browser-based application.

## Installation

```bash
npm install @vapi-ai/web
```

Or use the CDN script tag — no build step needed:
```html
<script src="https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js" defer async></script>
```

## Quick start — JavaScript

```javascript
import Vapi from '@vapi-ai/web';

const vapi = new Vapi('YOUR_PUBLIC_API_KEY');

// Start a call with your assistant
vapi.start('YOUR_ASSISTANT_ID');

// Listen to events
vapi.on('call-start', () => console.log('Call started'));
vapi.on('call-end', () => console.log('Call ended'));
vapi.on('speech-start', () => console.log('Agent speaking'));
vapi.on('speech-end', () => console.log('Agent done speaking'));

vapi.on('message', (message) => {
  if (message.type === 'transcript') {
    console.log(`${message.role}: ${message.transcript}`);
  }
});

// Stop a call
vapi.stop();
```

## Quick start — HTML script tag (fastest setup)

```html
<!DOCTYPE html>
<html>
<body>
<script>
  (function(d, t) {
    var g = document.createElement(t), s = d.getElementsByTagName(t)[0];
    g.src = "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
    g.defer = true; g.async = true;
    s.parentNode.insertBefore(g, s);
    g.onload = function() {
      window.vapiSDK.run({
        apiKey: "YOUR_PUBLIC_KEY",  // Public key only — safe for browser
        assistant: "YOUR_ASSISTANT_ID"
      });
    };
  })(document, "script");
</script>
</body>
</html>
```

This renders a floating call button on your page automatically.

## All event types

| Event | When it fires |
|---|---|
| `call-start` | WebRTC connection established, call is live |
| `call-end` | Call ended (by user, agent, or timeout) |
| `speech-start` | Agent starts speaking |
| `speech-end` | Agent stops speaking |
| `volume-level` | Volume meter data (0–1) for visualizations |
| `message` | Transcripts, tool calls, status updates |
| `error` | Any error during the call |

## Handling transcripts in real time

```javascript
vapi.on('message', (message) => {
  if (message.type === 'transcript' && message.transcriptType === 'final') {
    const { role, transcript } = message;
    // role is 'user' or 'assistant'
    addToTranscript(role, transcript);
  }
});
```

## Using a public key

The Web SDK uses your **Public API Key** — it is safe to expose in browser code. Never expose your Private API Key in the frontend.

## React / TypeScript

```bash
npm install @vapi-ai/web
```

```typescript
import Vapi from '@vapi-ai/web';
import { useEffect, useRef } from 'react';

const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_KEY!);

export function VoiceButton() {
  const [active, setActive] = useState(false);

  const toggle = () => {
    if (active) {
      vapi.stop();
      setActive(false);
    } else {
      vapi.start(process.env.NEXT_PUBLIC_ASSISTANT_ID!);
      setActive(true);
    }
  };

  return <button onClick={toggle}>{active ? 'End Call' : 'Talk to AI'}</button>;
}
```
