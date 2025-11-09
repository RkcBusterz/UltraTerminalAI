const history = [];

export function addToHistory(cmd, output) {
  history.push({ cmd, output });
  if (history.length > 20) history.shift();
}

export function getHistoryText() {
  return history
    .map((h) => `$ ${h.cmd}\n${h.output}`)
    .join("\n\n");
}
