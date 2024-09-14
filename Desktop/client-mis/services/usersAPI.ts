//Hosts and JWT
import { $authHost, $host } from "./index";

//Types
import { IUserInformationApi, IChangeUserData } from "@/types/types";

export const postRegistration = async (
  userInformation: IUserInformationApi
) => {
  try {
    const { data } = await $host.post("/api/customer/", userInformation);

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const getUserData = async (id: number) => {
  try {
    const { data } = await $authHost.get(`/api/customer/${id}`);

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const changeUserData = async (
  id: number,
  user: IChangeUserData,
  token: string
) => {
  try {
    const { data } = await $authHost.patch(`/api/customer/${id}/`, user, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const getUserOrders = async (id: number, token: string) => {
  try {
    const { data } = await $authHost.get(`/api/users/${id}/orders/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const getUserReviews = async (id: number, token: string) => {
  try {
    const { data } = await $authHost.get(`/api/users/${id}/reviews`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};
