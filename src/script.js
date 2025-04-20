import { getPvPLeaderboard } from "./modules/api/pvpLeaderboard.js";
import { createPagination } from "./modules/ui/pagination.js";
import { displayPage } from "./modules/ui/tableRenderer.js";

// Global state
let currentBracket = "2v2";
const region = "us";
let currentPage = 1;
let entriesPerPage = 100;
let allEntries = [];
let totalPages = 1;
let characterClassCache = {};

// DOM elements
const btn2v2 = document.getElementById("btn2v2");
const btn3v3 = document.getElementById("btn3v3");
const ladderTitle = document.querySelector("h1");

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  loadLadderData(currentBracket);
  btn2v2.addEventListener("click", () => switchBracket("2v2"));
  btn3v3.addEventListener("click", () => switchBracket("3v3"));

  // Add event listener for page changes
  document.addEventListener("changePage", (event) => {
    currentPage = event.detail.page;
    displayPage(
      currentPage,
      allEntries,
      entriesPerPage,
      characterClassCache,
      region
    );
    createPagination(totalPages, currentPage);
  });
});

async function loadLadderData(bracket) {
  try {
    const container = document.getElementById("ladderEntries");
    container.innerHTML =
      '<tr><td colspan="6" class="text-center py-8 text-gray-500">Loading...</td></tr>';

    const leaderboard = await getPvPLeaderboard(region, bracket);
    allEntries = leaderboard.entries.sort((a, b) => b.rating - a.rating);
    totalPages = Math.ceil(allEntries.length / entriesPerPage);

    displayPage(
      currentPage,
      allEntries,
      entriesPerPage,
      characterClassCache,
      region
    );
    createPagination(totalPages, currentPage);
  } catch (error) {
    console.error("Error loading ladder:", error);
    container.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-8 text-red-500">
          Failed to load ladder data. Please try again later.
        </td>
      </tr>
    `;
    document.getElementById("pagination").innerHTML = "";
  }
}

function switchBracket(bracket) {
  if (bracket === currentBracket) return;
  currentBracket = bracket;
  currentPage = 1;
  updateButtonStyles();
  ladderTitle.textContent = `${bracket} Arena Ladder`;
  loadLadderData(bracket);
}

function updateButtonStyles() {
  if (currentBracket === "2v2") {
    btn2v2.classList.add("active");
    btn2v2.classList.remove("inactive");
    btn3v3.classList.add("inactive");
    btn3v3.classList.remove("active");
  } else {
    btn3v3.classList.add("active");
    btn3v3.classList.remove("inactive");
    btn2v2.classList.add("inactive");
    btn2v2.classList.remove("active");
  }
}
