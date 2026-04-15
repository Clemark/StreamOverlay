// =====> Setting up Streamerbot Connection <=====
function updateClock() {
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  let hour12 = now.getHours() % 12;
  if (hour12 === 0) hour12 = 12;
  const ampm = now.getHours() < 12 ? "AM" : "PM";

  let timeElement = document.getElementById("time");
  if (timeElement) {
    timeElement.textContent = `${String(hour12).padStart(2, "0")}:${minutes} ${ampm}`;
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = months[now.getMonth()];
  const date = String(now.getDate());
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = days[now.getDay()];

  let dateElement = document.getElementById("date");
  if (dateElement) {
    dateElement.textContent = `${date} ${month} ${day}`;
  }
}

updateClock();
setInterval(updateClock, 1000);
