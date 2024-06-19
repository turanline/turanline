//Hosts
import { $authHost } from ".";

export const getFavorites = async (id: number) => {
  try {
    const { data } = await $authHost.get(`/api/customer/${id}/favorites/`);

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const patchUserFavorites = async (id: number, favorites: number[]) => {
  try {
    const { data } = await $authHost.patch(`/api/customer/${id}/`, {
      favorites,
    });

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};
