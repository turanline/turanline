//Hosts and JWT
import { $authHost, $host } from "./index";

//Types
import {
  IUserInformationApi,
  IChangeUserData,
  IPostRegistrationProvider,
} from "@/types/types";

export const postRegistration = async (
  requestString: "provider" | "customer",
  userInformation: IUserInformationApi | IPostRegistrationProvider
) => {
  try {
    const { data } = await $host.post(
      `/api/${requestString}/`,
      userInformation
    );

    return data;
  } catch (error) {
    throw new Error(`${error}`);
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
    const information = await getUserById(id);

    const requestString = information?.is_provider ? "provider" : "customer";

    const { data } = await $host.get(`/api/${requestString}/${id}`, {
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

export const getUserById = async (id: number) => {
  try {
    const { data } = await $host.get(`/api/users/${id}`);

    return data;
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

export const getProviderNews = async (token: string) => {
  try {
    const { data } = await $authHost.get("/api/superusernews/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const getProviderReviews = async (id: number, token: string) => {
  try {
    const { data } = await $authHost.get(`/api/provider/${id}/reviews/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};
