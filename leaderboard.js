import { getLeaderboardData } from "./firebase.js";

const leaderboardList = document.getElementById("leaderboardList");
const backBtn = document.getElementById("backBtn");

function createPlayerCard(player, index) {
  const item = document.createElement("div");
  item.className = "leaderboardItem";

  const title = document.createElement("h3");
  title.textContent = `${index + 1}. ${player.name || "Tanpa Nama"}`;

  const score = document.createElement("p");
  score.textContent = `Skor: ${player.score ?? 0}`;

  const correct = document.createElement("p");
  correct.textContent = `Benar: ${player.correct ?? 0}`;

  const avgTime = document.createElement("p");
  avgTime.textContent = `Waktu: ${player.avgTime ?? 0} detik`;

  item.appendChild(title);
  item.appendChild(score);
  item.appendChild(correct);
  item.appendChild(avgTime);

  return item;
}

async function loadLeaderboard() {
  leaderboardList.innerHTML = "<p>Loading ranking...</p>";

  try {
    const data = await getLeaderboardData();

    if (!data || data.length === 0) {
      leaderboardList.innerHTML = "<p>Belum ada pemain 😢</p>";
      return;
    }

    const sortedData = [...data].sort((a, b) => {
      if ((b.score ?? 0) !== (a.score ?? 0)) {
        return (b.score ?? 0) - (a.score ?? 0);
      }

      return (a.avgTime ?? 9999) - (b.avgTime ?? 9999);
    });

    leaderboardList.innerHTML = "";

    sortedData.forEach((player, index) => {
      leaderboardList.appendChild(createPlayerCard(player, index));
    });
  } catch (error) {
    console.error("Gagal memuat leaderboard:", error);
    leaderboardList.innerHTML = `<p>Gagal memuat leaderboard: ${error.message}</p>`;
  }
}

if (backBtn) {
  backBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

loadLeaderboard();