//Hosts
import { $host } from "./index";

export const getAllCategories = async () => {
  try {
    const {data}= await $host.get('/api/categories/?level=0');

    return data;
  } catch (error) {
    console.error("Failed to get categories: " + error);
    throw error;
  }
};

// export const getTypesByChildren = async (children: number) => {
//   try {
//     const { data, status } = await $host.get('/api/categories/', {params: { children }});

//     return { data, status };
//   } catch (error: any) {
//     if(error) return error;
//     console.error("Failed to get categories: " + error);
//   }
// };

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
    const { data } = await $host.get("/api/categories/", {params: { level: 1 }});

    return data;
  } catch (error) {
    console.error("Failed get types:" + error);
    throw error;
  }
};

export const getSubTypes = async () => {
  try {
    const { data } = await $host.get("/api/categories/", {params: { level: 2 }});

    return data;
  } catch (error) {
    console.error("Failed get subtypes:" + error);
    throw error;
  }
};
