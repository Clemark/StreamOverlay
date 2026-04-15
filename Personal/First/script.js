// =====> Setting up Streamerbot Connection <=====

const client = new StreamerbotClient({
  onConnect: () => {
    SetConnectionStatus(true);
  },
  onDisconnect: () => {
    SetConnectionStatus(false);
  },
});

client.on("General.Custom", (firstEvent) => {
  if (firstEvent.data.event === "firstRedeem") {
    highlight(firstEvent.data.username, firstEvent.data.pfpurl);
  }
});

function highlight(username, userProfile) {
  let userImage = document.querySelector(".profile");
  userImage.src = userProfile;
  let name = document.querySelector(".first");
  name.innerHTML = "FIRST: <span>" + username + "</span> is awesome";
}

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
