import { getCharacterClass, getCharacterSpec } from "../api/characterInfo.js";
import { getCharacterMedia } from "../api/characterMedia.js";
import { CLASS_COLORS } from "../utils/classColors.js";
import {
  calculateWinPercentage,
  capitalizeFirstLetter,
} from "../utils/helpers.js";

const DEFAULT_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+CiAgPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjMzMzIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNmZmYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+";

export async function displayPage(
  page,
  allEntries,
  entriesPerPage,
  characterClassCache,
  characterSpecCache,
  characterMediaCache,
  currentRegion
) {
  const container = document.getElementById("ladderEntries");
  container.innerHTML = "";

  const startIndex = (page - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, allEntries.length);
  const pageEntries = allEntries.slice(startIndex, endIndex);

  // Fetching Character Data
  const classPromises = pageEntries.map(async (entry) => {
    const cacheKey = `${entry.character.realm.slug}_${entry.character.name}`;
    if (!characterClassCache[cacheKey]) {
      const characterClass = await getCharacterClass(
        currentRegion,
        entry.character.realm.slug,
        entry.character.name
      );
      characterClassCache[cacheKey] = characterClass || "default";
    }
    return cacheKey;
  });

  const specPromises = pageEntries.map(async (entry) => {
    const cacheKey = `${entry.character.realm.slug}_${entry.character.name}`;
    if (!characterSpecCache[cacheKey]) {
      const characterSpec = await getCharacterSpec(
        currentRegion,
        entry.character.realm.slug,
        entry.character.name
      );
      characterSpecCache[cacheKey] = characterSpec || "default";
    }
    return cacheKey;
  });

  const mediaPromises = pageEntries.map(async (entry) => {
    const cacheKey = `${
      entry.character.realm.slug
    }_${entry.character.name.toLowerCase()}`;
    if (!characterMediaCache[cacheKey]) {
      try {
        const characterMedia = await getCharacterMedia(
          currentRegion,
          entry.character.realm.slug,
          entry.character.name
        );
        characterMediaCache[cacheKey] = characterMedia || DEFAULT_IMAGE;
      } catch {
        characterMediaCache[cacheKey] = DEFAULT_IMAGE;
      }
    }
    return cacheKey;
  });

  await Promise.all(classPromises);
  await Promise.all(specPromises);
  await Promise.all(mediaPromises);

  // Create each entry row
  pageEntries.forEach((entry, index) => {
    const row = document.createElement("tr");
    const globalRank = startIndex + index + 1;
    const cacheKey = `${entry.character.realm.slug}_${entry.character.name}`;
    const characterClass = characterClassCache[cacheKey] || "default";
    const characterSpec = characterSpecCache[cacheKey] || "default";
    const characterMedia = characterMediaCache[cacheKey] || "default";

    // Get the class color, default to white if not found
    const classColor = CLASS_COLORS[characterClass] || CLASS_COLORS.default;

    const capitalizedRealm = capitalizeFirstLetter(entry.character.realm.slug);
    const wins = entry.season_match_statistics.won;
    const losses = entry.season_match_statistics.lost;
    const winPercentage = calculateWinPercentage(wins, losses);

    const playerUrl = `/player/${entry.character.realm.slug}/${entry.character.name}`;

    row.classList.add("clickable-row");
    row.dataset.href = playerUrl;

    row.innerHTML = `
      <td width="8%" class="font-medium text-center text-white">${globalRank}</td>
      <td width="30%" class="player-name">
        <div class="flex items-center">
          <img 
        src="${
          characterMediaCache[
            `${
              entry.character.realm.slug
            }_${entry.character.name.toLowerCase()}`
          ] ||
          "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+CiAgPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjMzMzIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNmZmYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+"
        }" 
        alt="${entry.character.name}'s avatar"
        class="w-8 h-8 rounded-full mr-3 object-cover"
        onerror="this.onerror=null;this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+CiAgPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjMzMzIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNmZmYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'"
      >
          <span class="player-main" style="color: ${classColor}; font-weight: bold;" title="Class: ${characterClass}">${
      entry.character.name
    }</span>
        </div>
      </td>
      <td width="15%" class="font-bold text-white text-center">
        ${entry.rating}
      </td>
      <td width="15%" class="font-bold text-center">
        <span style="color: ${classColor}; font-weight: bold;" title="Specialization: ${characterSpec}">
          ${characterSpec !== "default" ? characterSpec : "Unknown"}
        </span>
      </td>
      <td width="12%" class="text-center text-white">
        <div class="flex items-center justify-center">
          <span>${capitalizedRealm}</span>
        </div>
      </td>
      <td width="15%" class="text-center">
        <span style="color:#4ade80;">${wins}</span><span style="color:white;"> - </span><span style="color:#f87171;">${losses}</span>
      </td>
      <td width="12%" class="text-center text-white">
        ${winPercentage}
      </td>
    `;

    row.addEventListener("click", function () {
      window.location.href = this.dataset.href;
    });

    container.appendChild(row);
  });
}
