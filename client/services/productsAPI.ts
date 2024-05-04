import { IProductsState } from "@/types/types";
import { $host, $authHost } from "./index";

export const getFamousProducts = async () => {
  const { data } = await $host.get("/api/catalog/famous");

  return data;
};

export const getSimilarProducts = async (slug: string) => {
  const { data } = await $host.get(`/api/catalog/${slug}/similar`);

  return data;
};

export const getAllProducts = async (
  category: string,
  obj: IProductsState["filters"]
) => {
  const params: any = {};

  const { brand, color, hbprice, lbprice, size } = obj;

  if (category !== "Все категории") params.cats = category;

  if (size) params.size = size;
  if (brand) params.brands = brand;
  if (color) params.color = color;
  if (lbprice) params.lbprice = lbprice;
  if (hbprice) params.hbprice = hbprice;

  const { data } = await $host.get(`/api/catalog/`, { params: { ...params } });

  return data;
};

export const getProductBySlug = async (slug: string) => {
  const { data } = await $host.get("/api/catalog/" + slug);

  return data;
};

export const postProduct = async ({ productInfo }: any) => {
  const { data } = await $authHost.post("/api/products/", productInfo);

  return data;
};

export const putProductBySlug = async (
  slug: string,
  updatedProductInfo: any
) => {
  const { data } = await $authHost.put(
    `/api/products/${slug}`,
    updatedProductInfo
  );

  return data;
};
export const patchProductBySlug = async (slug: string, updateData: object) => {
  const { data } = await $authHost.patch("/api/products/" + slug, updateData);

  return data;
};

export const deleteProductBySlug = async (slug: string) => {
  const { data } = await $authHost.delete(`/api/products/${slug}`);

  return data;
};
