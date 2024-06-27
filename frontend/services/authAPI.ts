//Hosts
import { $host, clearTokens } from "./index";

//Services
import { getUserById } from "./usersAPI";

//Types
import { IInputsLogin } from "@/types/types";

export const postTokenRefresh = async (
  refreshToken: string
): Promise<string> => {
  try {
    const { data } = await $host.post<{ access: string }>(
      "/api/token/refresh/",
      { refresh: refreshToken }
    );

    if (!data.access) {
      clearTokens();
      throw new Error("No access token in response");
    }

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

    if (!data.user) {
      clearTokens();
      throw new Error(`Error to verify token!`);
    }

    return data;
  } catch (error: any) {
    clearTokens();
    throw new Error(
      `Failed to verify token: ${error.response?.data || error.message}`
    );
  }
};

export const postLogIn = async (userData: IInputsLogin): Promise<any> => {
  try {
    const { data } = await $host.post("/api/token/", userData),
      { user } = await postVerifyToken(data.access),
      userInformation = await getUserById(user);

    localStorage.setItem("AuthTokenMis", data.access);
    localStorage.setItem("AuthTokenMisRef", data.refresh);

    return userInformation;
  } catch (error: any) {
    clearTokens();

    throw new Error(`Failed to log in: ${error.message}`);
  }
};
