// =====> Setting up Streamerbot Connection <=====

const client = new StreamerbotClient({
  onConnect: () => {
    SetConnectionStatus(true);
  },
  onDisconnect: () => {
    SetConnectionStatus(false);
  },
});

function SetConnectionStatus(connected) {
  let connectionStatus = document.querySelector("#connection-status");

  if (connected) {
    connectionStatus.textContent = "✔ Connected";
    connectionStatus.classList.remove("disconnected");
    connectionStatus.classList.add("connected");
  } else {
    connectionStatus.textContent = "↺ Connecting";
    connectionStatus.classList.remove("connected");
    connectionStatus.classList.add("disconnected");
  }
}
