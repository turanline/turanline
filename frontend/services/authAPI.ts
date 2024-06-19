//Hosts
import { $authHost, $host, clearTokens } from "./index";

export const postTokenRefresh = async (
  refreshToken: string
): Promise<string> => {
  try {
    const { data } = await $authHost.post<{ access: string }>(
      "/api/token/refresh/",
      { refresh: refreshToken }
    );
    if (!data.access) throw new Error("No access token in response");
    localStorage.setItem("AuthTokenMis", data.access);
    return data.access;
  } catch (error: any) {
    clearTokens();

    throw new Error(
      `Failed to refresh token: ${error.response?.data || error.message}`
    );
  }
};

export const postVerifyToken = async (
  token: string
): Promise<{ [key: string]: any }> => {
  if (!token) throw new Error("No token provided for verification");
  try {
    const { data } = await $host.post<{ [key: string]: any }>(
      "/api/token/verify/",
      { token }
    );
    return data;
  } catch (error: any) {
    throw new Error(
      `Failed to verify token: ${error.response?.data || error.message}`
    );
  }
};
