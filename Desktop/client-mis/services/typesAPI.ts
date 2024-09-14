import { $authHost, $host } from "./index";

export const getTypes = async () => {
  const { data } = await $host.get("/api/types/");

  return data;
};

export const postType = async ({ type }: any) => {
  const { data } = await $authHost.post("/api/types/", type);

  return data;
};

export const putTypeById = async (id: number, updatedTypeInfo: any) => {
  const { data } = await $authHost.put(`/api/types/${id}/`, updatedTypeInfo);

  return data;
};

export const patchTypeById = async (id: number, updateData: object) => {
  const { data } = await $authHost.patch(`/api/types/${id}/`, updateData);
  return data;
};

export const deleteTypeById = async (id: number) => {
  const { data } = await $authHost.delete(`/api/types/${id}`);

  return data;
};
