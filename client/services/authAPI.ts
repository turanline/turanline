import { $authHost, $host } from "./index";
import { jwtDecode } from "jwt-decode";

export const postLogin = async (userData: object) => {
  try {
    const { data } = await $host.post("/api/token/", userData);
    localStorage.setItem("AuthTokenMis", data?.access);
    localStorage.setItem("AuthTokenMisRef", data?.refresh);
    return jwtDecode(data?.access);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postTokenRefresh = async () => {
  try {
    const refreshToken = localStorage.getItem("AuthTokenMisRef");

    if (!refreshToken) {
      throw new Error("Refresh token is missing");
    }

    const { data } = await $authHost.post("/api/token/refresh/", {
      refresh: refreshToken,
    });

    localStorage.setItem("AuthTokenMis", data?.access);

    return data;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error;
  }
};

export const postVerifyToken = async (token: string | null) => {
  try {
    const { data } = await $host.post("/api/token/verify/", { token });
    return data;
  } catch (error) {
    console.error("Failed to verify token:", error);
    throw error;
  }
};
