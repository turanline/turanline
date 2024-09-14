//Hosts
import { $host, $authHost } from "./index";

//Types
import { IProductsState } from "@/types/types";

export const getFamousProducts = async () => {
  try {
    const { data } = await $host.get("/api/catalog/famous/");

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const getSimilarProducts = async (slug: string) => {
  try {
    const { data } = await $host.get(`/api/catalog/${slug}/similar/`);

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const getAllProducts = async (
  category: string,
  obj: IProductsState["filters"]
) => {
  try {
    const params: any = {};

    const { brand, color, hbprice, lbprice, size } = obj;

    if (category !== "Все категории") params.cats = category;

    if (size) params.size = size;
    if (brand) params.brands = brand;
    if (color) params.color = color;
    if (lbprice) params.lbprice = lbprice;
    if (hbprice) params.hbprice = hbprice;

    const { data } = await $host.get("/api/catalog/", {
      params: { ...params },
    });

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const getProductBySlug = async (slug: string) => {
  try {
    const { data } = await $host.get("/api/catalog/" + slug);

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const postProduct = async ({ productInfo }: any) => {
  try {
    const { data } = await $authHost.post("/api/products/", productInfo);

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const putProductBySlug = async (
  slug: string,
  updatedProductInfo: any
) => {
  try {
    const { data } = await $authHost.put(
      `/api/products/${slug}`,
      updatedProductInfo
    );

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};
export const patchProductBySlug = async (slug: string, updateData: object) => {
  try {
    const { data } = await $authHost.patch("/api/products/" + slug, updateData);

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const deleteProductBySlug = async (slug: string) => {
  try {
    const { data } = await $authHost.delete(`/api/products/${slug}/`);

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};
