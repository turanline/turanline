//Hosts
import { $authHost, $host, clearTokens } from "./index";
//Types
import { IInputsLogin } from "@/types/types";

export const postTokenRefresh = async () => {
  try {
    const refreshToken = localStorage.getItem("AuthTokenMisRef");

    if (!refreshToken) {
      throw new Error("Refresh token is missing");
    }

    const { data } = await $authHost.post("/api/token/refresh/", {
      refresh: refreshToken,
    });

    localStorage.setItem("AuthTokenMis", data.access);

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

export const postLogIn = async (userData: IInputsLogin): Promise<void> => {
  try {
    const { data } = await $host.post("/api/token/", userData);

    localStorage.setItem("AuthTokenMis", data.access);
    localStorage.setItem("AuthTokenMisRef", data.refresh);
  } catch (error: any) {
    clearTokens();

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
