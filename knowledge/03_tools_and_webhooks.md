# Tools and Webhooks

Tools let your Vapi assistant call external APIs and take actions during a live call.

## What are tools?

When the LLM decides it needs to call a tool, Vapi sends a POST request to your server URL with the tool call details. Your server processes it, executes the function, and returns the result. Vapi feeds the result back to the LLM to continue the conversation.

## Tool types in Vapi

- **Function tools**: Custom tools that hit your webhook server — most common
- **Transfer Call**: Transfer the live call to a phone number or another assistant
- **End Call**: End the call programmatically mid-conversation
- **DTMF**: Send dial-tone keypresses for IVR navigation
- **Google Calendar / Sheets / Slack**: Built-in native integrations, no custom server needed

## Defining a function tool (inline in the assistant config)

```python
tool = {
    "type": "function",
    "function": {
        "name": "check_availability",
        "description": "Check appointment slots for a given date and provider",
        "parameters": {
            "type": "object",
            "properties": {
                "date": {
                    "type": "string",
                    "description": "Date like '2026-03-25' or 'tomorrow' or 'next Monday'"
                },
                "provider": {
                    "type": "string",
                    "description": "Doctor or provider name"
                }
            },
            "required": ["date"]
        }
    },
    "server": {"url": "https://your-server.com/webhook"},
    "messages": [
        {"type": "request-start", "content": "Let me check that for you."}
    ]
}
```

Add it to your assistant under `model.tools`.

## Webhook request format

When a tool is called, Vapi POSTs this JSON to your server URL:
```json
{
  "message": {
    "type": "tool-calls",
    "toolCallList": [
      {
        "id": "call_abc123",
        "name": "check_availability",
        "arguments": {"date": "2026-03-25", "provider": "Dr. Smith"}
      }
    ]
  }
}
```

## Webhook response format — what your server must return

```json
{
  "results": [
    {
      "toolCallId": "call_abc123",
      "result": "Dr. Smith has openings at 9 AM, 11 AM, and 2 PM on March 25th."
    }
  ]
}
```

## Minimal Python webhook server (FastAPI)

```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

@app.post("/webhook")
async def webhook(request: Request):
    body = await request.json()
    message = body.get("message", {})

    if message.get("type") != "tool-calls":
        return JSONResponse({})

    results = []
    for call in message.get("toolCallList", []):
        name = call["name"]
        args = call["arguments"]
        result = handle_tool(name, args)
        results.append({"toolCallId": call["id"], "result": result})

    return JSONResponse({"results": results})

def handle_tool(name, args):
    if name == "check_availability":
        return f"Available at 9 AM and 2 PM on {args.get('date')}"
    return "Tool not found"
```

Run: `uvicorn main:app --reload --port 8000`

## Local development with ngrok

```bash
ngrok http 8000
# Outputs: https://abc123.ngrok.io
# Use this as your tool's server URL
```

## Saved vs inline tools

- **Inline**: Define the tool directly inside the assistant config under `model.tools`
- **Saved**: Create via `POST /tool`, get a tool ID, then reference with `model.toolIds` — reusable across multiple assistants
