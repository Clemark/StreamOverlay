// 🔧 CONFIG
const API_URL =
  "https://api.henrikdev.xyz/valorant/v2/by-puuid/mmr-history/ap/pc/205711c7-45c2-516c-b870-d4e0640b5954";

const TWITCH_UPTIME_URL = "https://decapi.me/twitch/uptime/clemxnade";

const REFRESH_INTERVAL = 2 * 60 * 1000;

// 🔑 API KEY FROM URL (?apiKey=xxxx)
const params = new URLSearchParams(window.location.search);
const apiKey = params.get("apiKey");
const headers = apiKey ? { Authorization: apiKey } : {};

// ⏱ parse uptime string → ms
function parseUptime(text) {
  if (!text || text.includes("offline")) return null;

  let hours = 0,
    minutes = 0,
    seconds = 0;

  const h = text.match(/(\d+)\s*hour/);
  const m = text.match(/(\d+)\s*minute/);
  const s = text.match(/(\d+)\s*second/);

  if (h) hours = parseInt(h[1]);
  if (m) minutes = parseInt(m[1]);
  if (s) seconds = parseInt(s[1]);

  return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

// ⏱ session start from Twitch uptime
async function getSessionStartTime() {
  try {
    const res = await fetch(TWITCH_UPTIME_URL);
    const text = await res.text();

    const uptimeMs = parseUptime(text);
    if (!uptimeMs) return null;

    return new Date(Date.now() - uptimeMs);
  } catch (err) {
    console.error("Uptime fetch failed:", err);
    return null;
  }
}

async function updateStats() {
  try {
    const sessionStart = await getSessionStartTime();

    const pointsEl = document.querySelector(".points");
    const scoreEl = document.querySelector(".score");

    // ❌ offline / no session
    if (!sessionStart) {
      if (pointsEl) {
        pointsEl.textContent = "FIRST GAME";
        pointsEl.classList.remove("positive", "negative");
      }
      if (scoreEl) scoreEl.textContent = "0 - 0";
      return;
    }

    const response = await fetch(API_URL, { headers });
    const data = await response.json();

    const history = data.data.history;

    let wins = 0;
    let losses = 0;
    let totalRR = 0;
    let foundMatch = false;

    history.forEach((match) => {
      const matchDate = new Date(match.date);

      if (matchDate >= sessionStart) {
        foundMatch = true;

        const rr = match.last_change;

        totalRR += rr;

        if (rr > 0) wins++;
        else if (rr < 0) losses++;
      }
    });

    // 🎯 FIRST GAME state
    if (!foundMatch) {
      if (pointsEl) {
        pointsEl.textContent = "FIRST GAME";
        pointsEl.classList.remove("positive", "negative");
      }
      if (scoreEl) scoreEl.textContent = "0 - 0";
      return;
    }

    // 📊 normal display
    const rrText = totalRR > 0 ? `+${totalRR} RR` : `${totalRR} RR`;
    const scoreText = `${wins} - ${losses}`;

    if (pointsEl) {
      pointsEl.textContent = rrText;

      pointsEl.classList.remove("positive", "negative");

      if (totalRR > 0) {
        pointsEl.classList.add("positive");
      } else if (totalRR < 0) {
        pointsEl.classList.add("negative");
      }
    }

    if (scoreEl) {
      scoreEl.textContent = scoreText;
    }
  } catch (err) {
    console.error("Update failed:", err);
  }
}

// 🚀 init
updateStats();

// 🔁 refresh loop
setInterval(updateStats, REFRESH_INTERVAL);
