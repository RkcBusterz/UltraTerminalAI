import "dotenv/config";
import fs from "fs";
import fetch from "node-fetch";

const backendurl = "https://aiterminal.ultravm.in";

// -----------------------------
// 🤖 ASK AI
// -----------------------------
export async function askAI(prompt) {
  const API_TOKEN = process.env.API_TOKEN;
  if (!API_TOKEN) throw new Error("❌ Missing API_TOKEN in .env file");

  try {
    const response = await fetch(`${backendurl}/api`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        auth: API_TOKEN,
      },
      body: JSON.stringify({ message: prompt }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`❌ Server error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("❌ askAI error:", err.message);
    return {
      output: "⚠️ Failed to connect to AI server.",
      command: null,
      end: true,
    };
  }
}

// -----------------------------
// 🔐 GENERATE TOKEN (writes to .env unless rate-limited)
// -----------------------------
export async function generateToken() {
  try {
    const res = await fetch(`${backendurl}/createtoken`);
    const text = await res.text();

    if (res.status === 429 || text.includes("Rate limit")) {
      let msg;
      try {
        msg = JSON.parse(text).message;
      } catch {
        msg = text;
      }
      return { rateLimited: true, message: msg.replace(/\n/g, " ") };
    }

    const token = text.trim();

    // Write token to .env
    let env = "";
    try {
      env = fs.existsSync(".env") ? fs.readFileSync(".env", "utf8") : "";
      if (env.includes("API_TOKEN=")) {
        env = env.replace(/API_TOKEN=.*/g, `API_TOKEN=${token}`);
      } else {
        env += `\nAPI_TOKEN=${token}`;
      }
      fs.writeFileSync(".env", env);
      process.env.API_TOKEN = token;
    } catch (err) {
      console.error("⚠️ Failed to update .env file:", err.message);
    }

    return { rateLimited: false, token };
  } catch (err) {
    console.error("❌ Error generating token:", err.message);
    return {
      rateLimited: false,
      token: null,
      message: "⚠️ Failed to reach backend server.",
    };
  }
}

// -----------------------------
// 📄 GET EXISTING TOKEN (just prints from .env)
// -----------------------------
export function getExistingToken() {
  try {
    const token = process.env.API_TOKEN || null;
    if (!token) {
      console.log("❌ No API token found in .env file.");
      return null;
    }

    console.log("🔑 Current API Token:");
    console.log(token);
    return token;
  } catch (err) {
    console.error("❌ Failed to read token:", err.message);
    return null;
  }
}
