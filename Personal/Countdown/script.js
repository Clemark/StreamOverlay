const DEFAULT_SECONDS = 120;
let remaining = DEFAULT_SECONDS;
let lastTick = null;
let running = true;

const blocks = {
  m1: document.getElementById("m1"),
  m2: document.getElementById("m2"),
  s1: document.getElementById("s1"),
  s2: document.getElementById("s2"),
};

function fillDigits(block, from, to) {
  block.innerHTML = "";
  for (let i = from; i <= to; i++) {
    const d = document.createElement("div");
    d.className = "digit";
    d.textContent = i;
    block.appendChild(d);
  }
}

fillDigits(blocks.m1, 0, 9);
fillDigits(blocks.m2, 0, 9);
fillDigits(blocks.s1, 0, 5);
fillDigits(blocks.s2, 0, 9);

function updateScroll(block, value) {
  const height = block.querySelector(".digit").clientHeight;
  block.style.transform = `translateY(${-height * value}px)`;
}

function updateUI() {
  let secs = Math.ceil(remaining);

  let mm = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  let ss = Math.floor(secs % 60)
    .toString()
    .padStart(2, "0");

  updateScroll(blocks.m1, parseInt(mm[0]));
  updateScroll(blocks.m2, parseInt(mm[1]));
  updateScroll(blocks.s1, parseInt(ss[0]));
  updateScroll(blocks.s2, parseInt(ss[1]));
}

function tick(now) {
  if (!lastTick) lastTick = now;
  const delta = (now - lastTick) / 1000;
  lastTick = now;

  if (running) {
    remaining -= delta;
    if (remaining <= 0) {
      remaining = 0;
      running = false;
    }
    updateUI();
  }

  requestAnimationFrame(tick);
}

updateUI();
// Fade-in fix to avoid black flash in OBS
if (document.fonts && document.fonts.load) {
  document.fonts.load("1em 'BBH Hegarty'").then(() => {
    document.querySelector(".timer").style.opacity = "1";
  });
} else {
  document.querySelector(".timer").style.opacity = "1";
}
requestAnimationFrame(tick);
