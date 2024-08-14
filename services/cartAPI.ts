//Hosts
import { $authHost } from "./index";
//Global Types
import { IPostCartApi, IPutCart } from "@/types/types";

export const getCart = async (id: number) => {
  try {
    const { data } = await $authHost.get(`/api/cart/${id}/`);

    return data;
  } catch (error) {
    console.error("Failed get user cart:" + error);
    throw error;
  }
};

export const postToCart = async (obj: IPostCartApi) => {
  try {
    const { data: orderData } = await $authHost.post("/api/order-products/", obj);

    return orderData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteFromCartById = async (id: number) => {
  try {
    const { data } = await $authHost.delete(`/api/order-products/${id}/`);

    return data;
  } catch (error) {
    console.error("Failed delete from user cart:" + error);
    throw error;
  }
};

export const patchCartItem = async (product: IPutCart, id: number) => {
  try {
    const { data } = await $authHost.put(`/api/order-products/${id}/`, product);

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const postUserOrder = async (obj: any) => {
  try {
    const { data } = await $authHost.post("/api/cart/confirm_order/", obj);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
