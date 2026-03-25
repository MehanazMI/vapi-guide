"""
setup_assistant.py — Creates VapiGuide AI (Tuttu) on Vapi.

Steps:
  1. Uploads all knowledge/*.md files to Vapi Files API
  2. Creates the Tuttu assistant with those file IDs (Vapi auto-creates a RAG query tool)
  3. Saves VAPI_ASSISTANT_ID to .env
  4. Prints the public key + assistant ID to paste into frontend/app.js

UTuttu:
    python scripts/setup_assistant.py

Requirements:
    pip install requests python-dotenv
"""

import json
import os
import sys
import time
import requests
from pathlib import Path

# ---------------------------------------------------------------------------
# Load config
# ---------------------------------------------------------------------------

ROOT = Path(__file__).parent.parent
ENV_PATH = ROOT / ".env"

# Load .env manually (no dotenv dependency check)
env_vars = {}
if ENV_PATH.exists():
    for line in ENV_PATH.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            env_vars[k.strip()] = v.strip()

VAPI_PRIVATE_KEY = env_vars.get("VAPI_PRIVATE_KEY") or os.environ.get("VAPI_PRIVATE_KEY")
VAPI_PUBLIC_KEY = env_vars.get("VAPI_PUBLIC_KEY") or os.environ.get("VAPI_PUBLIC_KEY")

if not VAPI_PRIVATE_KEY:
    print("ERROR: VAPI_PRIVATE_KEY not found in .env — cannot continue.")
    sys.exit(1)

BASE_URL = "https://api.vapi.ai"
HEADERS = {
    "Authorization": f"Bearer {VAPI_PRIVATE_KEY}",
    "Content-Type": "application/json",
}

KNOWLEDGE_DIR = ROOT / "knowledge"

# ---------------------------------------------------------------------------
# System prompt
# ---------------------------------------------------------------------------

SYSTEM_PROMPT = """You are Tuttu, a friendly and knowledgeable Vapi developer advocate for VapiGuide AI.

Your role is to help new developers quickly get started with Vapi — the developer platform for building voice AI agents.

You can answer questions about:
- What Vapi is and how it works
- How to create an assistant (dashboard and code)
- Getting API keys and making the first call
- Vapi tools, webhooks, and function calling
- Voice providers (Cartesia Sonic-3, ElevenLabs, Vapi native)
- The Vapi Web SDK and embedding voice in a web app
- Phone numbers and inbound/outbound calling
- Squads (multi-assistant orchestration)
- Pricing and free tier
- Common beginner questions and errors

Behavioral rules:
- Always answer in plain spoken English — never use markdown, bullet points, or numbered lists
- Keep responses under 60 words unless walking through steps
- Be encouraging and concise — developers are busy
- If asked for code, describe the key parts in plain English and mention the README has full examples
- Stay scoped to Vapi — politely redirect unrelated questions
- Always end with "What else can I help you with?" if the answer is short"""

# ---------------------------------------------------------------------------
# Step 1: Upload knowledge base files
# ---------------------------------------------------------------------------

def upload_file(filepath: Path) -> str:
    """Upload a single file to Vapi Files API. Returns the file ID."""
    print(f"  Uploading {filepath.name}...")
    with open(filepath, "rb") as f:
        response = requests.post(
            f"{BASE_URL}/file",
            headers={"Authorization": f"Bearer {VAPI_PRIVATE_KEY}"},
            files={"file": (filepath.name, f, "text/markdown")},
        )
    if response.status_code not in (200, 201):
        print(f"  ERROR uploading {filepath.name}: {response.status_code} {response.text}")
        return None
    file_id = response.json().get("id")
    print(f"  ✓ {filepath.name} → {file_id}")
    return file_id


def upload_knowledge_base() -> list[str]:
    """Upload all .md files in knowledge/ and return list of file IDs."""
    md_files = sorted(KNOWLEDGE_DIR.glob("*.md"))
    if not md_files:
        print("WARNING: No .md files found in knowledge/ directory.")
        return []

    print(f"\n📚 Uploading {len(md_files)} knowledge base files...")
    file_ids = []
    for fp in md_files:
        fid = upload_file(fp)
        if fid:
            file_ids.append(fid)
        time.sleep(0.5)  # gentle rate limiting

    print(f"✓ Uploaded {len(file_ids)} files\n")
    return file_ids


# ---------------------------------------------------------------------------
# Step 2: Create the Tuttu assistant
# ---------------------------------------------------------------------------

def create_assistant(file_ids: list[str]) -> dict:
    """Create the VapiGuide AI (Tuttu) assistant with knowledge base."""
    print("🤖 Creating VapiGuide AI (Tuttu) on Vapi...")

    payload = {
        "name": "VapiGuide AI — Tuttu",
        "firstMesTuttu": "Hey! I'm Tuttu — your voice guide to Vapi. Ask me anything about building voice agents — getting started, code examples, pricing. I've got you.",
        "firstMesTuttuMode": "assistant-speaks-first",
        "model": {
            "provider": "openai",
            "model": "gpt-4.1",
            "temperature": 0.3,
            "mesTuttus": [{"role": "system", "content": SYSTEM_PROMPT}],
            "knowledgeBase": {
                "provider": "canonical",
                "fileIds": file_ids,
            } if file_ids else None,
        },
        "voice": {
            "provider": "cartesia",
            "voiceId": "248be419-c632-4f23-adf1-5324ed7dbf1d",  # Jessica — Sonic-3
        },
        "transcriber": {
            "provider": "deepgram",
            "model": "nova-3",
            "language": "en",
        },
        "endCallMesTuttu": "Happy building! Reach out anytime you have more Vapi questions.",
        "endCallPhrases": ["goodbye", "thanks bye", "that's all", "i'm done", "bye"],
        "silenceTimeoutSeconds": 30,
        "maxDurationSeconds": 600,
        "backgroundSound": "off",
        "backchannelingEnabled": True,
        "backgroundDenoisingEnabled": True,
        "responseDelaySeconds": 0,
    }

    # Remove None values
    if payload["model"].get("knowledgeBase") is None:
        del payload["model"]["knowledgeBase"]

    response = requests.post(f"{BASE_URL}/assistant", headers=HEADERS, json=payload)

    if response.status_code not in (200, 201):
        print(f"ERROR creating assistant: {response.status_code}")
        print(response.text)
        sys.exit(1)

    return response.json()


# ---------------------------------------------------------------------------
# Step 3: Save and print results
# ---------------------------------------------------------------------------

def save_assistant_id(assistant_id: str):
    """Write VAPI_ASSISTANT_ID into .env file."""
    if ENV_PATH.exists():
        content = ENV_PATH.read_text()
        if "VAPI_ASSISTANT_ID=" in content:
            lines = []
            for line in content.splitlines():
                if line.startswith("VAPI_ASSISTANT_ID="):
                    lines.append(f"VAPI_ASSISTANT_ID={assistant_id}")
                else:
                    lines.append(line)
            ENV_PATH.write_text("\n".join(lines) + "\n")
        else:
            with open(ENV_PATH, "a") as f:
                f.write(f"\nVAPI_ASSISTANT_ID={assistant_id}\n")
    else:
        ENV_PATH.write_text(f"VAPI_ASSISTANT_ID={assistant_id}\n")


def save_config(assistant: dict):
    out = ROOT / "scripts" / "assistant_config.json"
    out.parent.mkdir(exist_ok=True)
    out.write_text(json.dumps(assistant, indent=2))
    print(f"Full config saved to scripts/assistant_config.json")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print("=" * 60)
    print("  VapiGuide AI — Setup Script")
    print("  Vapi, explained by Vapi")
    print("=" * 60)

    # 1. Upload knowledge base
    file_ids = upload_knowledge_base()

    # 2. Create assistant
    assistant = create_assistant(file_ids)
    assistant_id = assistant["id"]

    # 3. Save
    save_assistant_id(assistant_id)
    save_config(assistant)

    # 4. Print results
    print("\n" + "=" * 60)
    print("✅  Tuttu is live!")
    print("=" * 60)
    print(f"  Assistant ID:  {assistant_id}")
    print(f"  Public Key:    {VAPI_PUBLIC_KEY}")
    print(f"  KB files:      {len(file_ids)} uploaded")
    print()
    print("👉  Next step: Open frontend/app.js and update:")
    print(f'     const VAPI_PUBLIC_KEY  = "{VAPI_PUBLIC_KEY}";')
    print(f'     const ASSISTANT_ID      = "{assistant_id}";')
    print()
    print("👉  Then open frontend/index.html in your browser!")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    main()
