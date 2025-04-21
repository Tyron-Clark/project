import { getBattleNetToken } from "./battleNetApi.js";

export async function getCharacterClass(
  currentRegion,
  realmSlug,
  characterName
) {
  try {
    const token = await getBattleNetToken();
    const response = await axios.get(
      `https://${currentRegion}.api.blizzard.com/profile/wow/character/${realmSlug.toLowerCase()}/${characterName.toLowerCase()}`,
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

    // Add this line to get and return the class name
    return response.data.character_class?.name || null;
  } catch (error) {
    console.error(
      "Error fetching character class:",
      error.response?.data || error.message
    );
    return null;
  }
}
