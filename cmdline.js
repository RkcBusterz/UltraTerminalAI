// #!/usr/bin/env node
import readline from "readline";
import chalk from "chalk";
import os from "os";
import fs from "fs";
import process from "process";
import { askAI, generateToken, getExistingToken } from "./aiapi.js";
import { runCommand } from "./executor.js";
import { addToHistory, getHistoryText } from "./history.js";
import { parseAIResponse } from "./parseResponse.js";

let aiBusy = false;
const CHAT_LOG_FILE = "chat_history.txt"; // 📄 File to store chat messages

function getPrompt() {
  const cwd = process.cwd();
  return chalk.green(`UltraTerminalAI : ${cwd}> `);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: getPrompt(),
});

console.log(chalk.magenta.bold("\n=== UltraTerminalAI ==="));
console.log(
  chalk.red("AI can make mistakes. Use with caution! Always review commands before executing.\n")
);
console.log(chalk.cyan("🚀 UltraTerminalAI started. Type 'exit' to quit."));
console.log(chalk.yellow("💡 Type /help to see available commands.\n"));
rl.prompt();

async function askConfirm(question) {
  return new Promise((resolve) => {
    const confirmRl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    confirmRl.question(chalk.magenta(question), (answer) => {
      confirmRl.close();
      resolve(answer);
    });
  });
}

// 📥 Helper to save chat logs to file
function saveChat(user, ai) {
  const timestamp = new Date().toLocaleString();
  const formatted = `\n[${timestamp}]\n👤 User: ${user}\n🤖 AI: ${ai}\n${"-".repeat(60)}\n`;
  try {
    fs.appendFileSync(CHAT_LOG_FILE, formatted, "utf8");
  } catch (err) {
    console.error("⚠️ Failed to write chat log:", err.message);
  }
}

rl.on("line", async (line) => {
  const input = line.trim();

  if (input.toLowerCase() === "exit") {
    rl.close();
    return;
  }

  if (aiBusy) {
    console.log(chalk.red("⚠️ Please wait — AI is still processing..."));
    rl.prompt();
    return;
  }

  // 🧭 Help
  if (input === "/help") {
    console.log(chalk.cyan("\n📖 Available Commands:"));
    console.log(chalk.yellow("  !<command>") + chalk.white(" - Run a terminal command manually"));
    console.log(chalk.yellow("  /generateapi") + chalk.white(" - Generate and save a new API token (rate-limited)"));
    console.log(chalk.yellow("  /getapi") + chalk.white("      - Show your existing saved API token"));
    console.log(chalk.yellow("  /setapi <token>") + chalk.white(" - Manually set an API token"));
    console.log(chalk.yellow("  /help") + chalk.white("         - Show this help message"));
    console.log(chalk.yellow("  exit") + chalk.white("          - Quit UltraTerminalAI\n"));
    rl.prompt();
    return;
  }

  // 🔐 /generateapi → Get new token, write to .env (unless rate-limited)
  if (input === "/generateapi") {
    console.log(chalk.cyan("🔐 Requesting new API token..."));
    try {
      const result = await generateToken();

      if (result.rateLimited) {
        console.log(chalk.yellow(`⚠️ ${result.message}`));
        console.log(chalk.gray("(Token not saved due to rate limit.)"));
      } else if (result.token) {
        console.log(chalk.green("✅ New API token generated and saved to .env:"));
        console.log(chalk.yellow(result.token));
      } else {
        console.log(chalk.red("❌ Failed to generate a valid token."));
      }
    } catch (err) {
      console.log(chalk.red(`❌ Error generating token: ${err.message}`));
    }
    rl.prompt();
    return;
  }

  // 🔑 /getapi → Show existing token (no API call)
  if (input === "/getapi") {
    console.log(chalk.cyan("📄 Showing current saved API token..."));
    const token = getExistingToken();
    if (!token) {
      console.log(chalk.yellow("⚠️ No token found. Use /generateapi to create one."));
    }
    rl.prompt();
    return;
  }

  // ✏️ /setapi <token> → manually update .env
  if (input.startsWith("/setapi")) {
    const token = input.split(" ")[1];
    if (!token) {
      console.log(chalk.red("⚠️ Usage: /setapi <token>"));
      rl.prompt();
      return;
    }
    try {
      let env = fs.existsSync(".env") ? fs.readFileSync(".env", "utf8") : "";
      if (env.includes("API_TOKEN=")) {
        env = env.replace(/API_TOKEN=.*/g, `API_TOKEN=${token}`);
      } else {
        env += `\nAPI_TOKEN=${token}`;
      }
      fs.writeFileSync(".env", env);
      process.env.API_TOKEN = token;
      console.log(chalk.green("✅ API token updated in .env and environment:"));
      console.log(chalk.yellow(token));
    } catch (err) {
      console.log(chalk.red(`❌ Failed to set token: ${err.message}`));
    }
    rl.prompt();
    return;
  }

  // ⚙️ Run terminal command manually
  if (input.startsWith("!")) {
    const cmd = input.slice(1).trim();
    if (!cmd) {
      console.log(chalk.red("⚠️ Empty command."));
      rl.prompt();
      return;
    }
    console.log(chalk.yellow(`⚙️ Running user command: ${cmd}`));
    const output = await runCommand(cmd);
    console.log(chalk.gray("\n--- Command finished ---\n"));
    if (cmd.startsWith("cd ")) {
      try {
        const newDir = cmd.split(" ")[1];
        process.chdir(newDir);
      } catch (e) {
        console.log(chalk.red(`❌ Failed to change directory: ${e.message}`));
      }
    }
    addToHistory(cmd, output);
    rl.setPrompt(getPrompt());
    rl.prompt();
    return;
  }

  // 💬 AI processing
  aiBusy = true;
  await handleAIFlow(input);
  aiBusy = false;

  rl.setPrompt(getPrompt());
  rl.prompt();
});

rl.on("close", () => {
  console.log(chalk.green("\n👋 Goodbye!"));
  process.exit(0);
});

async function handleAIFlow(userInput) {
  let prompt = `User: ${userInput}\nSystem Info: ${os.platform()} (${os.release()})\nHistory:\n${getHistoryText()}`;
  let running = true;
  rl.pause();
  console.log(chalk.gray("⏳ [AI PROCESSING...]"));

  while (running) {
    const responseText = await askAI(prompt);
    const ai =
      typeof responseText === "string"
        ? parseAIResponse(responseText)
        : responseText;

    console.log(chalk.blueBright(`\n🤖 ${ai.output}\n`));

    // 📝 Save conversation to chat_history.txt
    saveChat(userInput, ai.output);

    if (ai.command && typeof ai.command === "string" && ai.command.trim() !== "") {
      ai.command = ai.command.replace(/^"+|"+$/g, "").trim();
      console.log(chalk.yellow(`⚙️ Suggested command: ${ai.command}`));

      const confirm = await askConfirm("Press [Enter] to run, or [SPACE] + [Enter] to skip: ");
      if (confirm.includes(" ")) {
        console.log(chalk.yellow("⏩ Skipped command."));
        prompt = `User skipped running command: ${ai.command}\nAI, what next?`;
      } else {
        console.log(chalk.cyan("⚡ Running command..."));
        const output = await runCommand(ai.command);
        console.log(chalk.gray("\n--- Command finished ---\n"));
        if (ai.command.startsWith("cd ")) {
          try {
            const newDir = ai.command.split(" ")[1];
            process.chdir(newDir);
          } catch (e) {
            console.log(chalk.red(`❌ Failed to change directory: ${e.message}`));
          }
        }
        addToHistory(ai.command, output);
        prompt = `Previous command output:\n${output}\nAI, what next?`;
      }
    } else {
      prompt = `AI said: ${ai.output}\nWhat next?`;
    }

    running = !ai.end;
    if (!running) {
      console.log(chalk.green("\n✅ AI finished. You can type again.\n"));
      rl.resume();
    } else {
      rl.pause();
      console.log(chalk.gray("⏳ [AI PROCESSING NEXT STEP...]"));
    }
  }
}
