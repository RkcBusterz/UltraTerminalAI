import { spawn } from "child_process";
import os from "os";

export function runCommand(command) {
  return new Promise((resolve, reject) => {
    if (!command || typeof command !== "string") {
      return resolve("(invalid command)");
    }

    const shell = os.platform() === "win32" ? "cmd.exe" : "/bin/bash";
    const args = os.platform() === "win32" ? ["/c", command] : ["-c", command];

    console.log("\n📤 Output:\n");

    const child = spawn(shell, args, { stdio: ["pipe", "pipe", "pipe"] });
    let output = "";

    child.stdout.on("data", (data) => {
      const text = data.toString();
      process.stdout.write(text); 
      output += text;
    });

    child.stderr.on("data", (data) => {
      const text = data.toString();
      process.stdout.write(text); // live error
      output += text;
    });

    child.on("error", (err) => {
      console.error(`❌ Failed to start command: ${err.message}`);
      resolve(`Command failed: ${err.message}`);
    });

    child.on("close", (code) => {
      resolve(output.trim() || `(process exited with code ${code})`);
    });
  });
}
