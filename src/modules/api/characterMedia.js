// import { CLASS_COLORS } from "../utils/classColors.js";
import { getBattleNetToken } from "./battleNetApi.js";

export async function getCharacterMedia(
  currentRegion,
  realmSlug,
  characterName
) {
  try {
    const token = await getBattleNetToken();
    const response = await axios.get(
      `https://${currentRegion}.api.blizzard.com/profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/character-media`,
      {
        params: {
          namespace: `profile-classic-${currentRegion}`,
          locale: "en_US",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.assets[0].value;
  } catch (error) {
    console.error(
      "Error fetching character media:",
      error.response?.status,
      error.response?.data || error.message
    );
    return null;
  }
}

export async function getClassMedia() {
  try {
    const token = await getBattleNetToken();
    const response = await axios.get(
      `https://us.api.blizzard.com/data/wow/playable-class/index`,
      {
        params: {
          namespace: `static-classic-us`,
          locale: `en_US`,
        },
        headers: {
          Authroization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {}
}
