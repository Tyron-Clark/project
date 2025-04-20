import { getCharacterClass } from "../api/characterInfo.js";
import { CLASS_COLORS } from "../utils/classColors.js";
import {
  calculateWinPercentage,
  capitalizeFirstLetter,
} from "../utils/helpers.js";

export async function displayPage(
  page,
  allEntries,
  entriesPerPage,
  characterClassCache,
  region
) {
  const container = document.getElementById("ladderEntries");
  container.innerHTML = "";

  const startIndex = (page - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, allEntries.length);
  const pageEntries = allEntries.slice(startIndex, endIndex);

  // Fetch class data for all visible entries
  const classPromises = pageEntries.map(async (entry) => {
    const cacheKey = `${entry.character.realm.slug}_${entry.character.name}`;
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

  await Promise.all(classPromises);

  // Create each entry row
  pageEntries.forEach((entry, index) => {
    const row = document.createElement("tr");
    const globalRank = startIndex + index + 1;
    const cacheKey = `${entry.character.realm.slug}_${entry.character.name}`;
    const characterClass = characterClassCache[cacheKey];
    const classColor = CLASS_COLORS[characterClass] || CLASS_COLORS.default;
    const capitalizedRealm = capitalizeFirstLetter(entry.character.realm.slug);
    const wins = entry.season_match_statistics.won;
    const losses = entry.season_match_statistics.lost;
    const winPercentage = calculateWinPercentage(wins, losses);

    row.innerHTML = `
      <td width="8%" class="font-medium text-center text-white">${globalRank}</td>
      <td width="30%" class="player-name">
        <div class="flex items-center">
          <span style="color: ${classColor}; font-weight: bold;">${entry.character.name}</span>
        </div>
      </td>
      <td width="15%" class="font-bold text-white text-center">
        ${entry.rating}
      </td>
      <td width="12%" class="text-center text-white">
        <div class="flex items-center justify-center">
          <span>${capitalizedRealm}</span>
        </div>
      </td>
      <td width="15%" class="text-center">
        <span style="color:green;">${wins}</span>-<span style="color:red;">${losses}</span>
      </td>
      <td width="12%" class="text-center text-white">
        ${winPercentage}
      </td>
    `;

    container.appendChild(row);
  });
}
