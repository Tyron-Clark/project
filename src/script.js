// Existing getBattleNetToken function remains unchanged
async function getBattleNetToken() {
  try {
    const response = await axios.post(
      "https://oauth.battle.net/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: "9a16c628d2144ef38080a7246f4abae2",
        client_secret: "MhklljVmwkdS7VN4SsRNmMek9F472uTp",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error(
      "Error fetching token:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Modified getPvPLeaderboard to accept bracket parameter
async function getPvPLeaderboard(region = "us", bracket = "3v3") {
  try {
    const token = await getBattleNetToken();
    const bracketPath = bracket === "2v2" ? "2v2" : "3v3";

    const response = await axios.get(
      `https://${region}.api.blizzard.com/data/wow/pvp-season/11/pvp-leaderboard/${bracketPath}`,
      {
        params: {
          namespace: `dynamic-classic-${region}`,
          locale: "en_US",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching leaderboard:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// New function to get character class information
async function getCharacterClass(region = "us", realmSlug, characterName) {
  try {
    const token = await getBattleNetToken();

    const response = await axios.get(
      `https://${region}.api.blizzard.com/profile/wow/character/${realmSlug.toLowerCase()}/${characterName.toLowerCase()}`,
      {
        params: {
          namespace: `profile-classic-${region}`,
          locale: "en_US",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.character_class?.name || null;
  } catch (error) {
    console.error(
      "Error fetching character class:",
      error.response?.data || error.message
    );
    return null;
  }
}

const CLASS_COLORS = {
  Druid: "#FF7C0A",
  Hunter: "#AAD372",
  Mage: "#3FC7EB",
  Monk: "#00FF98",
  Paladin: "#F48CBA",
  Priest: "#FFFFFF",
  Rogue: "#FFF468",
  Shaman: "#0070DD",
  Warlock: "#8788EE",
  Warrior: "#C69B6D",
  default: "#FFFFFF",
};

// Function to capitalize first letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to calculate win percentage
function calculateWinPercentage(wins, losses) {
  const total = wins + losses;
  if (total === 0) return "0%";
  return Math.round((wins / total) * 100) + "%";
}

// Global variables
let currentBracket = "2v2"; // Default to 2v2
const region = "us"; // You can make this configurable too
let currentPage = 1;
let entriesPerPage = 100;
let allEntries = [];
let totalPages = 1;
let characterClassCache = {}; // Cache for character class info

// DOM elements
const btn2v2 = document.getElementById("btn2v2");
const btn3v3 = document.getElementById("btn3v3");
const ladderTitle = document.querySelector("h1");
const container = document.getElementById("ladderEntries");

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize
  loadLadderData(currentBracket);

  // Event listeners
  btn2v2.addEventListener("click", () => switchBracket("2v2"));
  btn3v3.addEventListener("click", () => switchBracket("3v3"));

  // Update table headers to include win percentage column
  // const tableHeader = document.querySelector(".ladder-table thead tr");
  // if (tableHeader) {
  //   tableHeader.innerHTML = `
  //     <th width="8%">Rank</th>
  //     <th width="35%">Player</th>
  //     <th width="15%">Rating</th>
  //     <th width="15%">Wins</th>
  //     <th width="15%">Losses</th>
  //     <th width="12%">Win %</th>
  //   `;
  // }
});

function switchBracket(bracket) {
  if (bracket === currentBracket) return;

  currentBracket = bracket;
  currentPage = 1; // Reset to first page when switching brackets
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

async function loadLadderData(bracket) {
  try {
    const container = document.getElementById("ladderEntries");
    container.innerHTML =
      '<tr><td colspan="6" class="text-center py-8 text-gray-500">Loading...</td></tr>';

    // Fetch data
    const leaderboard = await getPvPLeaderboard(region, bracket);
    allEntries = leaderboard.entries.sort((a, b) => b.rating - a.rating);

    // Calculate total pages
    totalPages = Math.ceil(allEntries.length / entriesPerPage);

    // Display first page
    displayPage(currentPage);

    // Create pagination
    createPagination();
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

async function displayPage(page) {
  currentPage = page;
  const container = document.getElementById("ladderEntries");

  // Clear container
  container.innerHTML = "";

  // Calculate start and end indices
  const startIndex = (page - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, allEntries.length);

  // Get entries for current page
  const pageEntries = allEntries.slice(startIndex, endIndex);

  // Fetch class data for all visible entries (in parallel)
  const classPromises = pageEntries.map(async (entry) => {
    const cacheKey = `${entry.character.realm.slug}_${entry.character.name}`;

    // Check if class data is already cached
    if (!characterClassCache[cacheKey]) {
      const characterClass = await getCharacterClass(
        region,
        entry.character.realm.slug,
        entry.character.name
      );
      characterClassCache[cacheKey] = characterClass || "default";
    }
    return cacheKey;
  });

  // Wait for all class data to be fetched
  await Promise.all(classPromises);

  // Create each entry row
  pageEntries.forEach((entry, index) => {
    const row = document.createElement("tr");
    const globalRank = startIndex + index + 1;
    const cacheKey = `${entry.character.realm.slug}_${entry.character.name}`;
    const characterClass = characterClassCache[cacheKey];
    const classColor = CLASS_COLORS[characterClass] || CLASS_COLORS.default;

    // Capitalize realm name
    const capitalizedRealm = capitalizeFirstLetter(entry.character.realm.slug);

    // Calculate win percentage
    const wins = entry.season_match_statistics.won;
    const losses = entry.season_match_statistics.lost;
    const winPercentage = calculateWinPercentage(wins, losses);

    // Determine faction icon
    // const factionIcon = entry.faction?.type === "ALLIANCE" ? "👑" : "💀";

    row.innerHTML = `
      <td width="8%" class="font-medium text-center text-white">${globalRank}</td>
      <td width="30%" class="player-name">
        <div class="flex items-center">
          <span style="color: ${classColor}; font-weight: bold;">${entry.character.name}</span>
        </div>
      </td>
      <td width="15%" class="font-bold text-center text-white">
        ${entry.rating}
      </td>
      <td width="12%" class="text-center text-white">
        <div class="flex items-center justify-center">
    
          <span>${capitalizedRealm}</span>
        </div>
      </td>
      <td width="15%" class="text-center text-white">
        <span style="color: green;">${wins}</span>-<span style="color: red;">${losses}</span>
      </td>
      <td width="12%" class="text-center text-white">
        ${winPercentage}
      </td>
    `;

    container.appendChild(row);
  });

  // Update pagination active state
  updatePaginationActiveState();
}

function createPagination() {
  const paginationContainer = document.getElementById("pagination");

  // Make sure the pagination container exists
  if (!paginationContainer) {
    console.error("Pagination container not found!");
    return;
  }

  paginationContainer.innerHTML = "";

  // Don't show pagination if there's only one page
  if (totalPages <= 1) {
    return;
  }

  // Create pagination controls wrapper
  const paginationControls = document.createElement("div");
  paginationControls.classList.add("pagination-controls");

  // Create "First" button (<<)
  const firstBtn = document.createElement("button");
  firstBtn.innerHTML = "&laquo;";
  firstBtn.classList.add("pagination-btn");
  firstBtn.disabled = currentPage === 1;
  firstBtn.addEventListener("click", () => displayPage(1));
  paginationControls.appendChild(firstBtn);

  // Create "Previous" button (<)
  const prevBtn = document.createElement("button");
  prevBtn.innerHTML = "&lsaquo;";
  prevBtn.classList.add("pagination-btn");
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      displayPage(currentPage - 1);
    }
  });
  paginationControls.appendChild(prevBtn);

  // Create "Next" button (>)
  const nextBtn = document.createElement("button");
  nextBtn.innerHTML = "&rsaquo;";
  nextBtn.classList.add("pagination-btn");
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      displayPage(currentPage + 1);
    }
  });
  paginationControls.appendChild(nextBtn);

  // Create "Last" button (>>)
  const lastBtn = document.createElement("button");
  lastBtn.innerHTML = "&raquo;";
  lastBtn.classList.add("pagination-btn");
  lastBtn.disabled = currentPage === totalPages;
  lastBtn.addEventListener("click", () => displayPage(totalPages));
  paginationControls.appendChild(lastBtn);

  // Add pagination controls to container
  paginationContainer.appendChild(paginationControls);

  // Add page counter text
  const pageCounter = document.createElement("div");
  pageCounter.classList.add("page-counter");
  pageCounter.textContent = `Page ${currentPage} of ${totalPages}`;
  paginationContainer.appendChild(pageCounter);
}

function updatePaginationActiveState() {
  // Update button states
  const firstBtn = document.querySelector(".pagination-btn:nth-child(1)");
  const prevBtn = document.querySelector(".pagination-btn:nth-child(2)");
  const nextBtn = document.querySelector(".pagination-btn:nth-child(3)");
  const lastBtn = document.querySelector(".pagination-btn:nth-child(4)");
  const pageCounter = document.querySelector(".page-counter");

  if (firstBtn && prevBtn && nextBtn && lastBtn && pageCounter) {
    firstBtn.disabled = currentPage === 1;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    lastBtn.disabled = currentPage === totalPages;
    pageCounter.textContent = `Page ${currentPage} of ${totalPages}`;
  }
}

function getRatingColor(rating) {
  if (rating >= 2400) return "text-purple-600";
  if (rating >= 2200) return "text-red-600";
  if (rating >= 2000) return "text-orange-600";
  if (rating >= 1800) return "text-yellow-600";
  if (rating >= 1600) return "text-green-600";
  return "text-blue-600";
}
