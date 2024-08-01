//Hosts and JWT
import { $authHost, $host } from "./index";

//Global Types
import { IChangeUserData } from "@/types/types";

//Redux Types
import { IUserInformationApi } from "@/types/reduxTypes";

export const postRegistration = async (
  userInformation: Omit<IUserInformationApi, "address" | "company">
) => {
  try {
    const { data } = await $host.post("/api/customer/", userInformation);

    return data;
  } catch (error) {
    console.error("Failed post registration:" + error);
    throw error;
  }
};

export const getUserData = async (id: number) => {
  try {
    const { data } = await $authHost.get(`/api/customer/${id}`);

    return data;
  } catch (error) {
    console.error("Failed get user's data:" + error);
    throw error;
  }
};

export const changeUserData = async (id: number, user: IChangeUserData) => {
  try {
    const { data } = await $authHost.patch(`/api/customer/${id}/`, user);

    return data;
  } catch (error) {
    console.error("Failed change user's data:" + error);
    throw error;
  }
};

export const getUserOrders = async () => {
  try {
    const { data } = await $authHost.get(
      `/api/customer/get_customer_history//`
    );

    return data;
  } catch (error) {
    console.error("Failed get user's orders:" + error);
    throw error;
  }
};

export const getUserReviews = async () => {
  try {
    const { data } = await $authHost.get(`/api/users/reviews`);

    return data;
  } catch (error) {
    console.error("Failed get user's reviews:" + error);
    throw error;
  }
};
