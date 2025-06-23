let allStats = {};
let currentMode = "Sumo";

const myCurrentIGN = document.getElementById("myCurrentIGN");
const status = document.getElementById("status");
const networkLevel = document.getElementById("networkLevel");
const karma = document.getElementById("karma");

const title = document.getElementById("division");
const wins = document.getElementById("wins");
const losses = document.getElementById("losses");
const roundsPlayed = document.getElementById("roundsPlayed");
const currentWinStreak = document.getElementById("currentWinStreak");
const bestWinStreak = document.getElementById("bestWinStreak");
const kills = document.getElementById("kills");
const deaths = document.getElementById("deaths");
const modeTitle = document.getElementById("modeTitle");

function getModeTitle(stats, mode) {
  const titles = [
    "rookie", "iron", "gold", "diamond", "master",
    "legend", "grandmaster", "godlike", "legendary",
    "titan", "olympian", "divine"
  ];
  for (let i = titles.length - 1; i >= 0; i--) {
    const key = `${mode.toLowerCase()}_${titles[i]}_title_prestige`;
    if (stats[key] !== undefined) {
      return toTitleCase(titles[i]);
    }
  }
  return "Unknown";
}

function toTitleCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function animateChange(el, html) {
  if (el.innerHTML === html) return;
  el.classList.add("fade-out");
  setTimeout(() => {
    el.innerHTML = html;
    el.classList.remove("fade-out");
    el.classList.add("fade-in");
    setTimeout(() => el.classList.remove("fade-in"), 300);
  }, 200);
}

function renderModeStats() {
  const stats = allStats.duelsStats || {};
  const prefix = `${currentMode.toLowerCase()}_duel_`;
  const baseKey = prefix.slice(0, -1);

  const titleMap = {
    Sumo: "My Sumo Stats",
    Classic: "My Classic Stats",
    Bridge: "My Bridge Stats",
    Overall: "My Overall Stats"
  };
  const colorMap = {
    Sumo: "#5feb52",
    Classic: "#52a7ff",
    Bridge: "#ffaa00",
    Overall: "#ffffff"
  };

  animateChange(modeTitle, titleMap[currentMode] || "Stats");
  modeTitle.style.color = colorMap[currentMode] || "white";

  if (currentMode === "Overall") {
    animateChange(title, getModeTitle(stats, "all_modes"));
    animateChange(wins, `${stats["wins"] ?? 0} WINS`);
    animateChange(losses, `${stats["losses"] ?? 0} LOSSES`);
    animateChange(roundsPlayed, `${stats["rounds_played"] ?? 0} ROUNDS PLAYED`);
    animateChange(currentWinStreak, `${stats["current_winstreak"] ?? 0} WIN STREAK`);
    animateChange(bestWinStreak, `${stats["best_all_modes_winstreak"] ?? 0} BEST STREAK`);
    animateChange(kills, `${stats["kills"] ?? 0} KILLS`);
    animateChange(deaths, `${stats["deaths"] ?? 0} DEATHS`);
    return;
  }
  if (currentMode == "Bridge") {
    animateChange(title, allStats.duelsStats[`bridge_duel_title_prestige`]);
    animateChange(wins, `${stats[`${prefix}wins`] ?? 0} WINS`);
    animateChange(losses, `${stats[`${prefix}losses`] ?? 0} LOSSES`);
    animateChange(roundsPlayed, `${stats[`${prefix}rounds_played`] ?? 0} ROUNDS PLAYED`);
    animateChange(currentWinStreak, `${stats[`current_winstreak_mode_${baseKey}`] ?? 0} WIN STREAK`);
    animateChange(bestWinStreak, `${stats[`best_winstreak_mode_${baseKey}`] ?? 0} BEST STREAK`);
    animateChange(kills, `${stats["bridge_duel_bridge_kills"] ?? 0} KILLS`);
    animateChange(deaths, `${stats["bridge_duel_bridge_deaths"] ?? 0} DEATHS`);
    return
  }


  animateChange(title, allStats.duelsStats[`${currentMode.toLowerCase()}_duel_title_prestige`]);
  animateChange(wins, `${stats[`${prefix}wins`] ?? 0} WINS`);
  animateChange(losses, `${stats[`${prefix}losses`] ?? 0} LOSSES`);
  animateChange(roundsPlayed, `${stats[`${prefix}rounds_played`] ?? 0} ROUNDS PLAYED`);
  animateChange(currentWinStreak, `${stats[`current_winstreak_mode_${baseKey}`] ?? 0} WIN STREAK`);
  animateChange(bestWinStreak, `${stats[`best_winstreak_mode_${baseKey}`] ?? 0} BEST STREAK`);
  animateChange(kills, `${stats[`${prefix}${currentMode.toLowerCase()}_kills`] ?? 0} KILLS`);
  animateChange(deaths, `${stats[`${prefix}${currentMode.toLowerCase()}_deaths`] ?? 0} DEATHS`);
}

function setMode(mode) {
  currentMode = mode;
  document.querySelectorAll(".duel-buttons button").forEach(btn => {
    btn.classList.toggle("active", btn.innerText === mode);
  });
  renderModeStats();
}

async function fetchStats() {
  try {
    const res = await fetch("https://api.koupi.dev/api/me");
    const data = await res.json();
    allStats = data;

    animateChange(myCurrentIGN, data.ign);
    animateChange(
      status,
      data.status === "online"
        ? `<span class="online">Online!</span> — Playing ${data.playing}`
        : `<span class="offline">Offline</span> (Last login: ${data.lastLogin})`
    );
    animateChange(networkLevel, `${data.networkLevel}`);
    animateChange(karma, `${data.karma}`);

    renderModeStats();
  } catch (err) {
    console.error("API fetch failed:", err);
  }
}

document.querySelectorAll(".duel-buttons button").forEach(btn =>
  btn.addEventListener("click", () => setMode(btn.innerText))
);

fetchStats();
setInterval(fetchStats, 10000);
