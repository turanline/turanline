import { $authHost, $host } from "./index";

export const getAllProvidersGoods = async (user: string) => {
  try {
    const { data } = await $authHost.get(`/api/provider/${user}/products`);

    return data;
  } catch (error) {
    console.error(error);
  }
};