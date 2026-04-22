// 🔧 CONFIG
const API_URL =
  "https://api.henrikdev.xyz/valorant/v2/by-puuid/mmr-history/ap/pc/205711c7-45c2-516c-b870-d4e0640b5954";

const CARD_API_URL =
  "https://api.henrikdev.xyz/valorant/v1/by-puuid/account/205711c7-45c2-516c-b870-d4e0640b5954";

const TWITCH_UPTIME_URL = "https://decapi.me/twitch/uptime/clemxnade";

const REFRESH_INTERVAL = 2 * 60 * 1000;

// 🔑 API KEY FROM URL (?apiKey=xxxx)
const params = new URLSearchParams(window.location.search);
const apiKey = params.get("apiKey");
const headers = apiKey ? { Authorization: apiKey } : {};

// 🧠 cache
let cachedSessionStart = null;
let cachedCardUrl = null;

// ⏱ parse uptime → ms
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

// ⏱ get session start (cached)
async function getSessionStart() {
  if (cachedSessionStart) return cachedSessionStart;

  try {
    const res = await fetch(TWITCH_UPTIME_URL);
    const text = await res.text();

    const uptimeMs = parseUptime(text);
    if (!uptimeMs) return null;

    cachedSessionStart = new Date(Date.now() - uptimeMs);
    return cachedSessionStart;
  } catch (err) {
    console.error("Uptime fetch failed:", err);
    return null;
  }
}

// 🎨 apply background
function applyBackground(url) {
  const wrapper = document.querySelector(".main-wrapper");
  if (!wrapper) return;

  wrapper.style.backgroundImage = `
    linear-gradient(var(--background), var(--background2)),
    url("${url}")
  `;
  wrapper.style.backgroundSize = "cover";
}

// 🖼 fetch player card (cached)
async function updateBackground() {
  try {
    if (cachedCardUrl) {
      applyBackground(cachedCardUrl);
      return;
    }

    const res = await fetch(CARD_API_URL, { headers });
    const data = await res.json();

    console.log(data);

    const cardUrl = data.data?.card?.wide;

    if (cardUrl) {
      cachedCardUrl = cardUrl;
      applyBackground(cardUrl);
    }
  } catch (err) {
    console.error("Card fetch failed:", err);
  }
}

// 📊 update stats
async function updateStats() {
  try {
    const sessionStart = await getSessionStart();

    const pointsEl = document.querySelector(".points");
    const scoreEl = document.querySelector(".score");

    let wins = 0;
    let losses = 0;
    let totalRR = 0;

    if (sessionStart) {
      const res = await fetch(API_URL, { headers });
      const data = await res.json();

      const history = data?.data?.history || [];

      history.forEach((match) => {
        const matchDate = new Date(match.date);

        if (matchDate >= sessionStart) {
          const rr = match.last_change;

          totalRR += rr;

          if (rr > 0) wins++;
          else if (rr < 0) losses++;
        }
      });
    }

    // 🧾 display (absolute RR only)
    const rrText = `${Math.abs(totalRR)} RR`;
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
    console.error("Stats update failed:", err);
  }
}

// 🚀 init
updateStats();
updateBackground();

// 🔁 refresh every 2 minutes
setInterval(() => {
  updateStats();
  updateBackground();
}, REFRESH_INTERVAL);
