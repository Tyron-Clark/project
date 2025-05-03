import { getBattleNetToken } from "./battleNetApi.js";

// Function to get complete character information
export async function getCharacterInfo(
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

    return response.data || null;
  } catch (error) {
    console.error(
      "Error fetching character info:",
      error.response?.data || error.message
    );
    return null;
  }
}

export async function getCharacterClass(
  currentRegion,
  realmSlug,
  characterName
) {
  try {
    const characterData = await getCharacterInfo(
      currentRegion,
      realmSlug,
      characterName
    );

    if (
      characterData &&
      characterData.character_class &&
      characterData.character_class.name
    ) {
      return characterData.character_class.name;
    }

    return null;
  } catch (error) {
    console.error("Error extracting character class:", error);
    return null;
  }
}

export async function getCharacterAvatar(
  currentRegion,
  realmSlug,
  characterName
) {
  try {
    const characterData = await getCharacterInfo(
      currentRegion,
      realmSlug,
      characterName
    );
    if (!characterData || !characterData.media || !characterData.media.href) {
      return null;
    }
    const token = await getBattleNetToken();
    const response = await axios.get(characterData.media.href, {
      params: {
        namespace: `profile-classic-${currentRegion}`,
        locale: "en_US",
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const mediaData = response.data;
    return mediaData.assets[0].value;
  } catch (error) {
    console.error(
      "Error fetching character media:",
      error.response?.data || error.message
    );
    return null;
  }
}

export async function getCharacterSpec(
  currentRegion,
  realmSlug,
  characterName
) {
  try {
    const characterData = await getCharacterInfo(
      currentRegion,
      realmSlug,
      characterName
    );

    if (
      !characterData ||
      !characterData.specializations ||
      !characterData.specializations.href
    ) {
      return null;
    }

    const token = await getBattleNetToken();
    const response = await axios.get(characterData.specializations.href, {
      params: {
        namespace: `profile-classic-${currentRegion}`,
        locale: "en_US",
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const specData = response.data;

    // Find and return the active specialization
    const activeGroup = specData.specialization_groups.find(
      (group) => group.is_active
    );

    return activeGroup?.specializations?.[0].specialization_name || null;
  } catch (error) {
    console.error(
      "Error fetching character specialization:",
      error.response?.data || error.message
    );
    return null;
  }
}
