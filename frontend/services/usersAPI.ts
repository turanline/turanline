//Hosts and JWT
import { jwtDecode } from "jwt-decode";
import { $authHost, $host } from "./index";

//Types
import {
  IUserInformationApi,
  IChangeUserData,
  IInputsLogin,
} from "@/types/types";

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

export const postLogin = async (userData: IInputsLogin): Promise<any> => {
  try {
    const { data } = await $host.post("/api/token/", userData);

    if (data.access && data.refresh) {
      localStorage.setItem("AuthTokenMis", data.access);
      localStorage.setItem("AuthTokenMisRef", data.refresh);
    }

    return jwtDecode(data.access);
  } catch (error: any) {
    throw new Error(`Failed to log in: ${error.message}`);
  }
};

export const postLogOut = async (refreshToken: string) => {
  try {
    const { data } = await $host.post("/api/token/logout/", {
      refresh: refreshToken,
    });

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const getUserData = async (id: number, token: string) => {
  try {
    const { data } = await $host.get(`/api/customer/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
    const { data } = await $host.get(`/api/users/${id}/orders/`, {
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
    const { data } = await $host.get(`/api/users/${id}/reviews`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};
