# 🧠 UltraTerminalAI

**UltraTerminalAI** is a smart AI assistant designed to work **directly inside your terminal**.  
It helps you automate commands, manage servers, and get real-time AI assistance — all through simple text.

---

## 🚀 Installation

Install UltraTerminalAI globally using npm:

```bash
npm install -g uvm-terminal-ai
```

Once installed, start the AI terminal assistant by running:

```bash
uvmai
```

---

## ⚙️ API Setup

UltraTerminalAI requires an **API key** to connect with the UltraVM AI service.

### 🪄 Generate a new API key
Run:
```bash
/generateapi
```

This command will:
- Request a **new API key** from the UltraVM AI backend  
- Automatically **save it to your `.env` file**  
- Respect the **12-hour rate limit** per IP (you can only generate once every 12 hours)  

If the rate limit is reached, you’ll see:
```
⚠️ Rate limit reached. You can generate a new token again in 10h 23m.
```

---

### 🔑 View your existing API key
If you already have a key saved, you can check it using:
```bash
/getapi
```

This will simply display the currently stored API token from your `.env` file — it does **not** request a new one.

---

### ✏️ Manually set an API key
If you already have a valid key from the billing system, set it manually:
```bash
/setapi <your_api_key_here>
```

This updates your `.env` file and environment instantly.

---

## 💳 Billing & Management

UltraTerminalAI runs on the **UltraVM AI Platform**, and each user requires an active plan to access AI tokens.

### 🌐 Billing Portal
Visit the official billing portal to:
- Purchase or renew your AI plan  
- Manage your existing API keys  

👉 **[https://billing.ultravm.tech](https://billing.ultravm.tech)**

Once a plan is purchased, your API key will automatically get activated.  
If it expires, renew your plan and regenerate a new one with `/generateapi`.

---

## ⚠️ Important Notice

```bash
AI can make mistakes. Use with caution!
Always review commands before executing them.
```

UltraTerminalAI can execute real system commands — **verify each action before confirming**.  
If you encounter issues or unexpected behavior, report them to the **UltraVM support team**.

---

## 💻 Example Usage

```bash
uvmai
```

Sample session:
```
UltraTerminalAI : ~/projects> /generateapi
✅ New API token generated and saved to .env

UltraTerminalAI : ~/projects> How to list all Docker containers?
🤖 Run this command:
docker ps -a
```

---

## ✨ Features

- 🤖 AI-powered assistant inside terminal  
- 🧩 Execute terminal commands safely  
- 💬 Natural language understanding  
- 🔐 Secure API key generation & management  
- ⚡ Rate-limited `/generateapi` for security  
- ☁️ UltraVM billing integration  
- 🧠 Automatic token usage tracking  
- 🕒 Cleans inactive API keys after 7 days  

---

## 📦 Package Info

- **Name:** `uvm-terminal-ai`  
- **Command:** `uvmai`  
- **Version:** `1.0.0` *(update as needed)*  
- **Author:** UltraVM Technologies  
- **License:** All Rights Reserved  
- **Website:** [https://ultravm.tech](https://ultravm.tech)  

---

## ❤️ Made by UltraVM

Built for developers and sysadmins who live in the terminal.  
UltraTerminalAI combines the power of AI with the simplicity of command-line control.

> 💬 *“Because your terminal deserves to be intelligent.”*
