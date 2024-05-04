//Global
import { $authHost } from "./index";

//Types
import { IPostCartApi, IPutCart } from "@/types/types";

export const getCart = async () => {
  const { data } = await $authHost.get("/api/cart/");

  return data;
};

export const postToCart = async ({ amount, product }: IPostCartApi) => {
  const { data } = await $authHost.post("/api/cart/", { amount, product });

  return data;
};

export const patchCartItem = async ({ amount, productId }: IPutCart) => {
  const { data } = await $authHost.patch(`/api/cart/${productId}/`, {
    amount,
  });

  return data;
};

export const deleteFromCartById = async (id: number) => {
  const { data } = await $authHost.delete(`/api/cart/${id}`);

  return data;
};
