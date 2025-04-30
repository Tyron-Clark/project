import { getBattleNetToken } from "./battleNetApi.js";

export async function getPvPLeaderboard(region = "eu", bracket = "2v2") {
  try {
    const token = await getBattleNetToken();
    const bracketPath = bracket === "2v2" ? "2v2" : "3v3";
    const regionPath = region === "us" ? "us" : "eu";

    const response = await axios.get(
      `https://${regionPath}.api.blizzard.com/data/wow/pvp-season/11/pvp-leaderboard/${bracketPath}`,
      {
        params: {
          namespace: `dynamic-classic-${regionPath}`,
          locale: "en_US",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching leaderboard:",
      error.response?.data || error.message
    );
    throw error;
  }
}
