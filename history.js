const history = [];

export function addToHistory(cmd, output) {
  history.push({ cmd, output });

  if (history.length > 35) history.shift();
}

export function getHistoryText() {
  // Return all previous commands and outputs joined together
  return history
    .map((h) => `$ ${h.cmd}\n${h.output}`)
    .join("\n\n");
}
