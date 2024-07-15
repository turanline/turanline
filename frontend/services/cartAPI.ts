//Hosts
import { $authHost } from "./index";

//Global Types
import { IPostCartApi, IPutCart } from "@/types/types";

export const getCart = async () => {
  try {
    const { data } = await $authHost.get("/api/cart/");

    return data;
  } catch (error) {
    console.error("Failed get user cart:" + error);
    throw error;
  }
};

export const postToCart = async (obj: IPostCartApi) => {
  try {
    const { data } = await $authHost.post("/api/cart/", obj);

    return data;
  } catch (error) {
    console.error("Failed post to user cart:" + error);
    throw error;
  }
};

export const patchCartItem = async ({ amount, productId }: IPutCart) => {
  try {
    const { data } = await $authHost.patch(`/api/cart/${productId}/`, {
      amount,
    });

    return data;
  } catch (error) {
    console.error("Failed patch user cart:" + error);
    throw error;
  }
};

export const deleteFromCartById = async (id: number) => {
  try {
    const { data } = await $authHost.delete(`/api/cart/${id}/`);

    return data;
  } catch (error) {
    console.error("Failed delete from user cart:" + error);
    throw error;
  }
};
