//Hosts and JWT
import { $authHost, $host } from "./index";
import { setCookie } from "cookies-next";
//Types
import { IChangeUserData } from "@/types/types";
import { IUserInformationApi } from "@/types/reduxTypes";

export const postRegistration = async (userInformation: IUserInformationApi) => {
  try {
    const { data,status } = await $host.post("/api/customer/", userInformation);

    if(status === 200){
      setCookie("AuthTokenMis", data.access);
      setCookie("AuthTokenMisRef", data.refresh);
    }

    return { data,status };
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
    const { data } = await $authHost.get("/api/customer/get_customer_history/");

    return data;
  } catch (error) {
    console.error("Failed get user's orders:" + error);
    throw error;
  }
};

export const getUserReviews = async () => {
  try {
    const { data } = await $authHost.get("/api/users/reviews");

    return data;
  } catch (error) {
    console.error("Failed get user's reviews:" + error);
    throw error;
  }
};
