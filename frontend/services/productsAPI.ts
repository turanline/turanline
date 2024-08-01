//Hosts
import { $host } from "./index";

//Redux Types
import { IProductsState } from "@/types/reduxTypes";

export const getFamousProducts = async () => {
  try {
    const { data } = await $host.get("/api/catalog/famous/");

    return data;
  } catch (error) {
    console.error("Failed get famous products:" + error);
    throw error;
  }
};

export const getSimilarProducts = async (slug: string) => {
  try {
    const { data } = await $host.get(`/api/catalog/${slug}/similar/`);

    return data;
  } catch (error) {
    console.error("Failed get similar products:" + error);
    throw error;
  }
};

export const getAllProducts = async (
  category: string,
  filters: IProductsState["filters"]
) => {
  try {
    const params: Record<string, string | number> = {};

    if (category !== "Все категории") {
      params.cats = category;
    }

    const filterKeys: (keyof IProductsState["filters"])[] = [
      "size",
      "brand",
      "color",
      "lbprice",
      "hbprice",
    ];

    filterKeys.forEach(key => {
      const value = filters[key];
      if (value) {
        params[key === "brand" ? "brands" : key] = value;
      }
    });

    const { data } = await $host.get("/api/catalog/", {
      params,
    });

    return data;
  } catch (error) {
    console.error("Error fetching products:" + error);
    throw error;
  }
};

export const getProductBySlug = async (slug: string, language: string) => {
  try {
    const { data } = await $host.get(`/api/catalog/${slug}/`, {
      headers: { "Accept-Language": language },
    });

    return data;
  } catch (error) {
    console.error("Error get product by slug:" + error);
    throw error;
  }
};
