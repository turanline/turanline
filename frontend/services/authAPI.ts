//Hosts
import { $authHost, $host, clearTokens } from "./index";

//Global Types
import { IInputsLogin } from "@/types/types";

//Cookie
import { getCookie, setCookie } from "cookies-next";

export const postTokenRefresh = async () => {
  try {
    const refreshToken = getCookie("AuthTokenMisRef");

    if (!refreshToken) console.error("Refresh token is missing");

    const { data } = await $authHost.post("/api/token/refresh/", {
      refresh: refreshToken,
    });

    setCookie("AuthTokenMis", data?.access);

    return data;
  } catch (error) {
    console.error("Failed to refresh token:", error);
  }
};

export const postVerifyToken = async (token: string | null) => {
  try {
    const { data } = await $host.post("/api/token/verify/", { token });

    return data;
  } catch (error) {
    console.error("Failed to verify token:", error);
  }
};

export const postLogIn = async (userData: IInputsLogin) => {
  try {
    const { data } = await $host.post("/api/token/", userData);

    setCookie("AuthTokenMis", data.access);
    setCookie("AuthTokenMisRef", data.refresh);

    return data;
  } catch (error: any) {
    clearTokens();
    console.error("Failed to log in:", error);
    throw error;
  }
};

export const postLogOut = async (refreshToken: string) => {
  try {
    const { data } = await $authHost.post("/api/token/logout/", {
      refresh: refreshToken,
    });

    return data;
  } catch (error) {
    clearTokens();
    console.error("Failed to log out:" + error);
    throw error;
  }
};
