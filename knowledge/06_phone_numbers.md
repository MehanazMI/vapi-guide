# Phone Numbers

Vapi supports both inbound and outbound phone calls via real PSTN phone numbers.

## Buying a Vapi phone number

```python
import requests

response = requests.post(
    "https://api.vapi.ai/phone-number",
    headers={"Authorization": "Bearer YOUR_PRIVATE_KEY"},
    json={
        "provider": "vapi",
        "areaCode": "415",           # US area code
        "assistantId": "YOUR_ASSISTANT_ID"  # Attach immediately
    }
)
phone = response.json()
print(f"Your number: {phone['number']}")  # e.g. +14155550100
```

## Importing your own number (Twilio / Vonage / Telnyx)

If you already have a Twilio number:
```python
response = requests.post(
    "https://api.vapi.ai/phone-number",
    headers={"Authorization": "Bearer YOUR_PRIVATE_KEY"},
    json={
        "provider": "twilio",
        "number": "+14155550100",
        "twilioAccountSid": "YOUR_TWILIO_SID",
        "twilioAuthToken": "YOUR_TWILIO_TOKEN",
        "assistantId": "YOUR_ASSISTANT_ID"
    }
)
```

## Inbound calls

Once a phone number is attached to an assistant, any call to that number automatically starts a conversation with the assistant. The assistant answers with its configured first message.

## Outbound calls

Make a call from your assistant to any phone number:
```python
response = requests.post(
    "https://api.vapi.ai/call",
    headers={"Authorization": "Bearer YOUR_PRIVATE_KEY"},
    json={
        "assistantId": "YOUR_ASSISTANT_ID",
        "phoneNumberId": "YOUR_VAPI_NUMBER_ID",
        "customer": {
            "number": "+1-555-123-4567",  # Number to dial
            "name": "John Doe"
        }
    }
)
call_id = response.json()["id"]
```

## Dashboard workflow

1. Go to Build > Phone Numbers
2. Click Buy Number (choose area code and country)
3. Select your assistant in the "Inbound" dropdown
4. Done — your assistant now answers that number

## Web calls (no phone number required)

For browser-based calls, use the Web SDK with just your public key and assistant ID — no phone number purchase needed.
