//Hosts
import { $host } from "./index";

export const getCategories = async () => {
  try {
    const { data } = await $host.get("/api/categories/");

    return data;
  } catch (error) {
    console.error("Failed get categories:" + error);
    throw error;
  }
};

export const getCategoryById = async (id: number) => {
  try {
    const { data } = await $host.get(`/api/categories/${id}/`);

    return data;
  } catch (error) {
    console.error("Failed get category by id:" + error);
    throw error;
  }
};

export const getTypes = async () => {
  try {
    const { data } = await $host.get("/api/categories/", {
      params: { level: 1 },
    });

    return data;
  } catch (error) {
    console.error("Failed get types:" + error);
    throw error;
  }
};

export const getSubTypes = async () => {
  try {
    const { data } = await $host.get("/api/categories/", {
      params: { level: 2 },
    });

    return data;
  } catch (error) {
    console.error("Failed get subtypes:" + error);
    throw error;
  }
};
