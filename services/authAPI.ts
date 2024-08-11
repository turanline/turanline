//Hosts
import { $authHost, $host, clearTokens } from "./index";
//Global Types
import { IInputsLoginPost ,IResetPassword} from "@/types/types";
//Cookie
import { getCookie, setCookie } from "cookies-next";

export const postTokenRefresh = async () => {
  try {
    const refreshToken = getCookie("AuthTokenMisRef");

    if (!refreshToken) console.error("Refresh token is missing");

    const { data } = await $authHost.post("/api/token/refresh/", {refresh: refreshToken});

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

export const postLogIn = async (userData: IInputsLoginPost) => {
  try {
    const { data } = await $host.post("/api/token/", userData);

    setCookie("AuthTokenMis", data.access);
    setCookie("AuthTokenMisRef", data.refresh);

    return data;
  } catch (error: any) {
    clearTokens();
    throw new Error(error.response.status);
  }
};

export const postLogOut = async (refreshToken: string) => {
  try {
    const { data } = await $authHost.post("/api/token/logout/", {refresh: refreshToken});

    return data;
  } catch (error) {
    clearTokens();
    console.error("Failed to log out:" + error);
    throw error;
  }
};




export const postConfirmCode = async (phone_number: string,verification_code: string) => {
  try {
    const { data,status } = await $host.post("/api/users/compare_verification_code/", {phone_number,verification_code});

    if(data){
      setCookie("AuthTokenMis", data.access);
      setCookie("AuthTokenMisRef", data.refresh);
    }

    return {data,status};
  } catch (error: any) {
    console.error(error);

    console.error(`Failed to post SMS: ${error.message}`);
  }
};

export const getVerifySmsCode = async (phone_number: string,purpose: string) => {
  try {
    const { data,status } = await $host.post("/api/users/receive_verification_code/", {phone_number,purpose});
    
    return { data,status };
  } catch (error: any) {
    if(error){
      return error;
    }
    console.error(`Failed get SMS: ${error.message}`);
  }
};

export const resetUserPassword = async (userData: IResetPassword) => {
  try {
    const { data,status } = await $host.post("/api/users/reset_password/", userData);
    
    return {data:data ,status: status};
  } catch (error: any) {
    if(error){
      return error;
    }
    throw new Error(error);
  }
};
