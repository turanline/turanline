//Hosts
import { $authHost } from ".";

export const getFavorites = async () => {
  try {
    const { data } = await $authHost.get("/api/customer/favorites/");

    return data;
  } catch (error) {
    console.error("Failed get user favorites:" + error);
    throw error;
  }
};

export const patchUserFavorites = async (id: number, favorites: number[]) => {
  try {
    const { data } = await $authHost.patch(`/api/customer/${id}/`, {favorites});

    return data;
  } catch (error) {
    console.error("Failed patch user favorites:" + error);
    throw error;
  }
};
