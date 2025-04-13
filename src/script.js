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

async function getPvPLeaderboard(region = "us") {
  try {
    const token = await getBattleNetToken();

    const response = await axios.get(
      `https://${region}.api.blizzard.com/data/wow/pvp-season/11/pvp-leaderboard/3v3`,
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

// Usage example
(async () => {
  try {
    const leaderboard = await getPvPLeaderboard();
    console.log("Leaderboard data:", leaderboard);
  } catch (error) {
    // Handle errors
  }
})();
