import { getPvPLeaderboard } from "./modules/api/pvpLeaderboard.js";
import { createPagination } from "./modules/ui/pagination.js";
import { displayPage } from "./modules/ui/tableRenderer.js";

// Global state
let currentBracket = "2v2";
let currentRegion = "eu";
let currentPage = 1;
let entriesPerPage = 100;
let allEntries = [];
let totalPages = 1;
let characterClassCache = {};
let characterSpecCache = {};

// DOM elements
const btn2v2 = document.getElementById("btn2v2");
const btn3v3 = document.getElementById("btn3v3");
const btnRegionEU = document.getElementById("btnRegionEU");
const btnRegionNA = document.getElementById("btnRegionNA");
const ladderTitle = document.querySelector("h1");

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  updateButtonStyles();
  loadLadderData(currentRegion, currentBracket);
  btn2v2.addEventListener("click", () => switchBracket("2v2"));
  btn3v3.addEventListener("click", () => switchBracket("3v3"));
  btnRegionEU.addEventListener("click", () => switchRegion("eu"));
  btnRegionNA.addEventListener("click", () => switchRegion("us"));

  // Listen for changePage events from pagination components
  document.addEventListener("changePage", (event) => {
    currentPage = event.detail.page;
    displayPage(
      currentPage,
      allEntries,
      entriesPerPage,
      characterClassCache,
      characterSpecCache,
      currentRegion
    );
    createPagination(totalPages, currentPage);
  });
});

function updateDisplay() {
  displayPage(
    currentPage,
    allEntries,
    entriesPerPage,
    characterClassCache,
    characterSpecCache,
    currentRegion
  );
  createPagination(totalPages, currentPage);
}

async function loadLadderData(region, bracket) {
  const container = document.getElementById("ladderEntries");
  try {
    container.innerHTML =
      '<tr><td colspan="7" class="text-center py-8 text-gray-500">Loading...</td></tr>';

    const leaderboard = await getPvPLeaderboard(region, bracket);
    allEntries = leaderboard.entries.sort((a, b) => b.rating - a.rating);
    totalPages = Math.ceil(allEntries.length / entriesPerPage);

    updateDisplay();
  } catch (error) {
    console.error("Error loading ladder:", error);
    container.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-8 text-red-500">
          Failed to load ladder data. Please try again later.
        </td>
      </tr>`;
    createPagination(0, 0);
  }
}

function switchBracket(bracket) {
  if (bracket === currentBracket) return;
  currentBracket = bracket;
  currentPage = 1;
  updateButtonStyles();
  loadLadderData(currentRegion, currentBracket);
}

function switchRegion(region) {
  if (region === currentRegion) return;
  currentRegion = region;
  currentPage = 1;
  characterClassCache = {};
  characterSpecCache = {};
  updateButtonStyles();
  loadLadderData(currentRegion, currentBracket);
}

function updateButtonStyles() {
  // Update bracket buttons
  btn2v2.classList.toggle("active", currentBracket === "2v2");
  btn2v2.classList.toggle("inactive", currentBracket !== "2v2");
  btn3v3.classList.toggle("active", currentBracket === "3v3");
  btn3v3.classList.toggle("inactive", currentBracket !== "3v3");

  // Update region buttons
  btnRegionEU.classList.toggle("active", currentRegion === "eu");
  btnRegionEU.classList.toggle("inactive", currentRegion !== "eu");
  btnRegionNA.classList.toggle("active", currentRegion === "us");
  btnRegionNA.classList.toggle("inactive", currentRegion !== "us");
}
