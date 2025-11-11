const history = [];

export function addToHistory(cmd, output) {
  history.push({ cmd, output });

  // Keep only the last 20 entries in memory
  if (history.length > 20) history.shift();
}

export function getHistoryText() {
  // Return all previous commands and outputs joined together
  return history
    .map((h) => `$ ${h.cmd}\n${h.output}`)
    .join("\n\n");
}
