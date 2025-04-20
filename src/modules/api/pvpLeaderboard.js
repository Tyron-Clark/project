import { getBattleNetToken } from "./battleNetApi.js";

export async function getPvPLeaderboard(region = "us", bracket = "3v3") {
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
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching leaderboard:",
      error.response?.data || error.message
    );
    throw error;
  }
}
