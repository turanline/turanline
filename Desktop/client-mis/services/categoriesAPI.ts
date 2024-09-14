//Hosts
import { $authHost, $host } from "./index";

export const getCategories = async () => {
  try {
    const { data } = await $host.get("/api/categories/");

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const getCategoryById = async (id: number) => {
  try {
    const { data } = await $host.get(`/api/categories/${id}/`);

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const postCategory = async (name: string) => {
  try {
    const { data } = await $authHost.post("/api/categories/", { name });

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const putCategoryById = async (id: number) => {
  try {
    const { data } = await $authHost.put(`/api/categories/${id}/`);

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const patchCategoryById = async (id: number, updateData: object) => {
  try {
    const { data } = await $authHost.patch(
      `/api/categories/${id}/`,
      updateData
    );

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const deleteCategoryById = async (id: number) => {
  try {
    const { data } = await $authHost.delete(`/api/categories/${id}/`);

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const getTypes = async () => {
  try {
    const { data } = await $host.get("/api/types/");

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const getSubTypes = async () => {
  try {
    const { data } = await $host.get("/api/subtypes/");

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};
