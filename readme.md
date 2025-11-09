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
/getapi
```

This will create a new API key and show it on your screen.  
Use this key to activate your access and start using the AI.

### 🔑 Use an existing API key
If you already have an API key from a previous session or plan, use:
```bash
/setapi <your_api_key_here>
```

---

## 💳 Billing & Plans

UltraTerminalAI runs on the **UltraVM AI Platform**.  
Each user requires an active plan to access AI tokens.

### 🌐 Billing Portal
Visit the official billing portal to:
- Purchase an API plan  
- Upgrade or renew your subscription  
- View your token usage and remaining balance  
- Manage multiple API keys

👉 **[https://billing.ultravm.tech](https://billing.ultravm.tech)**

### 🧾 Available Plans (Example)
| Plan | Tokens | Validity | Price (INR) |
|------|---------|-----------|--------------|
| Starter | 50,000 | 30 Days | ₹99 |
| Standard | 250,000 | 30 Days | ₹299 |
| Pro | 1,000,000 | 30 Days | ₹999 |

Once a plan is purchased, your API key will automatically get activated.  
If you lose access, you can always generate a new one with `/getapi`.

---

## ⚠️ Important Notice

```bash
AI can make mistakes. Use with caution!
Always review commands before executing them.
```

UltraTerminalAI has permission to execute system commands, so **verify every action before confirming**.  
If you encounter issues or unexpected behavior, please report it to the UltraVM support team.

---

## 💻 Example Usage

```bash
uvmai
> check which process is using port 25590
```

AI might respond with:
```bash
sudo lsof -i :25590
```
and will run it safely after user confirmation.

---

## ✨ Features

- 🤖 AI-powered assistant inside terminal  
- 🧩 Execute terminal commands safely  
- 💬 Natural language understanding  
- 🔐 Secure API key management  
- ☁️ UltraVM billing integration  
- 🧠 Automatic usage tracking and token limits  
- 🕒 Cleans inactive API keys after 7 days  

---

## 📦 Package Info

- **Name:** `uvm-terminal-ai`  
- **Command:** `uvmai`  
- **Version:** `1.0.0` *(update as needed)*  
- **Author:** UltraVM Technologies  
- **License:** MIT  
- **Website:** [https://ultravm.tech](https://ultravm.tech)  

---

## ❤️ Made by UltraVM

Built for developers and sysadmins who live in the terminal.  
UltraTerminalAI combines the power of AI with the simplicity of command-line control.

> 💬 *“Because your terminal deserves to be intelligent.”*
