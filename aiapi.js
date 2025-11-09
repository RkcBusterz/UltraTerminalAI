import "dotenv/config";
import fs from "fs";
import fetch from "node-fetch";

backendurl = "https://aiterminal.ultravm.in"
async function askAI(prompt) {
  const API_TOKEN = process.env.API_TOKEN;
  if (!API_TOKEN) throw new Error("❌ Missing API_TOKEN in .env file");

  try {
    const response = await fetch(backendurl+"/api", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth": API_TOKEN,
        "message": encodeURIComponent(prompt)
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`❌ Server error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("❌ askAI error:", err.message);
    return "⚠️ Failed to connect to AI server.";
  }
}

async function generateToken() {
  const backendUrl = backendurl;
  const response = await fetch(`${backendUrl}/createtoken`);
  const token = (await response.text()).trim();

  let env = fs.readFileSync(".env", "utf8");
  if (env.includes("API_TOKEN=")) {
    env = env.replace(/API_TOKEN=.*/g, `API_TOKEN=${token}`);
  } else {
    env += `\nAPI_TOKEN=${token}`;
  }
  fs.writeFileSync(".env", env);

  process.env.API_TOKEN = token;
  return token;
}

module.exports = { askAI, generateToken };
