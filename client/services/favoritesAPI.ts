//Global
import { $authHost } from ".";

export const getFavorites = async (id: number) => {
  const { data } = await $authHost.get(`/api/users/${id}/favorites`);

  return data;
};

export const patchUserFavorites = async (id: number, favorites: number[]) => {
  const { data } = await $authHost.patch(`/api/users/${id}`, { favorites });

  return data;
};
