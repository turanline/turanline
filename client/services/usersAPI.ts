//Global
import { $authHost, $host } from "./index";
import { IProfileInputs, IUserInformationApi } from "@/types/types";

export const postRegistration = async (
  userInformation: IUserInformationApi
) => {
  const { data } = await $host.post("/api/users/", userInformation);

  return data;
};

export const getUserData = async (id: number, token: string) => {
  const { data } = await $host.get(`/api/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const changeUserData = async (
  id: number,
  user: IProfileInputs,
  token: string
) => {
  const { data } = await $host.patch(`/api/users/${id}`, user, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const getUserOrders = async (id: number, token: string) => {
  const { data } = await $host.get(`/api/users/${id}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const getUserReviews = async (id: number, token: string) => {
  const { data } = await $host.get(`/api/users/${id}/reviews`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};
