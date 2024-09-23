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

export const deleteUserFavorites = async (product_id: number) => {
  try {
    const { data } = await $authHost.delete(`/api/customer/favorites/remove-favorites/${product_id}/`);

    return data;
  } catch (error) {
    console.error("Failed patch user favorites:" + error);
    throw error;
  }
};

export const addUserFavorites = async (product_id: number) => {
  try {
    const { data } = await $authHost.post(`/api/customer/favorites/add-favorites/${product_id}/`);

    return data;
  } catch (error) {
    console.error("Failed patch user favorites:" + error);
    throw error;
  }
};

