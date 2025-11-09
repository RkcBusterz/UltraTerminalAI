export function parseAIResponse(text) {
  try {
    if (typeof text !== "string") {
      return text;
    }

    const cleaned = text
      .replace(/```json|```/g, "")
      .replace(/^[^({\[]+/, "")
      .trim();

    const jsonStart = cleaned.indexOf("{");
    const jsonEnd = cleaned.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1)
      throw new Error("Invalid JSON segment");

    const jsonStr = cleaned.slice(jsonStart, jsonEnd + 1);

    console.log("[DEBUG] parseAIResponse cleaned JSON string:\n", jsonStr);

    const data = JSON.parse(jsonStr);

    // Normalize types and fallbacks
    const output =
      typeof data.output === "string" ? data.output : JSON.stringify(data.output);
    const command =
      typeof data.command === "string" && data.command !== "null"
        ? data.command.trim()
        : null;
    const end =
      typeof data.end === "boolean"
        ? data.end
        : String(data.end).toLowerCase() === "true";

    return { output, command, end };
  } catch (err) {
    console.error("❌ parseAIResponse error:", err.message);
    return { output: text, command: null, end: true };
  }
}
