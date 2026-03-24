# Squads — Multi-Assistant Orchestration

Squads let you compose multiple specialized Vapi assistants that hand off to each other during a single call, preserving full conversation context.

## When to use Squads vs Assistants

Use a **single assistant** when:
- Your use case fits one system prompt
- The conversation follows a single domain (e.g. scheduling only)

Use a **Squad** when:
- You need specialized agents for different steps (e.g. triage → scheduling → billing)
- Different stages need different voices, prompts, or tools
- You want each assistant to be independently tuned

## How Squads work

1. A call starts with the first assistant in the squad (the "entry" assistant)
2. That assistant can transfer control to any other assistant in the squad
3. Conversation context is preserved across all transfers
4. Each assistant can have its own voice, tools, and system prompt

## Creating a Squad

```python
import requests

response = requests.post(
    "https://api.vapi.ai/squad",
    headers={"Authorization": "Bearer YOUR_PRIVATE_KEY"},
    json={
        "name": "Medical Clinic Squad",
        "members": [
            {
                "assistantId": "TRIAGE_ASSISTANT_ID",
                "assistantDestinations": [
                    {
                        "assistantName": "Scheduler",
                        "assistantId": "SCHEDULER_ASSISTANT_ID",
                        "description": "Transfer here when patient wants to book an appointment"
                    }
                ]
            },
            {
                "assistantId": "SCHEDULER_ASSISTANT_ID",
                "assistantDestinations": []
            }
        ]
    }
)
squad_id = response.json()["id"]
```

## Transfer tool

Assistants in a squad use a transfer tool to hand off:
```json
{
  "type": "transferCall",
  "destinations": [
    {
      "type": "assistant",
      "assistantName": "Scheduler",
      "description": "Transfer when patient wants to book"
    }
  ]
}
```

## Real-world Squad examples

- **E-commerce**: Greeter → Order Status → Returns → VIP Support
- **Healthcare**: Intake → Triage → Scheduling → Billing
- **Support**: Tier-1 Agent → Tier-2 Specialist → Human Escalation

## Squad vs single assistant: latency

Squads add a small (~100ms) transfer latency between assistants. For most use cases this is imperceptible. Single assistants have zero transfer overhead.
