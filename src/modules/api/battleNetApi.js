// import axios from "axios";

export async function getBattleNetToken() {
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
