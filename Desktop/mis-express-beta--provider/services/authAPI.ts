//Hosts
import { $authHost, $host, clearTokens } from "./index";
//Cookies
import { setCookie,getCookie } from 'cookies-next';
//Types
import {ILogin, IResetPassword } from "@/types/additionalTypes";

export const postTokenRefresh = async () => {
  try {
    const refreshToken = getCookie('AuthTokenMisRef');
    if (!refreshToken) throw new Error('Refresh token is missing');

    const { data } = await $authHost.post('/api/token/refresh/', { refresh: refreshToken });
    setCookie('AuthTokenMis', data?.access);
  
    return data;
  } catch (error: any) {
    console.error('Failed to refresh token:', error);
  }
};

export const postVerifyToken = async (token: string | null) => {
  try {
    const { data } = await $host.post('/api/token/verify/', { token });
    return data;

  } catch (error: any) {
    console.error('Failed to verify token:', error);
  }
};


export const postLogIn = async (userData: ILogin) => {
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

export const postVerifySmsCode = async (phone_number: string,verification_code: string) => {
  try {
    const { data } = await $host.post("/api/provider/compare_verification_code/", {phone_number,verification_code});
    
    setCookie("AuthTokenMis", data.access);
    setCookie("AuthTokenMisRef", data.refresh);

    return data;
  } catch (error: any) {
    console.error(`Failed to post SMS: ${error.message}`);
  }
};
export const getVerifySmsCode = async (phone_number: string) => {
  try {
    const { data } = await $host.post("/api/provider/receive_verification_code/", {phone_number});
    
    return data;
  } catch (error: any) {
    console.error(`Failed get SMS: ${error.message}`);
  }
};
export const resetUserPassword = async (userData: IResetPassword) => {
  try {
    const { data } = await $host.post("/api/users/reset_password/", userData);
    
    return data;
  } catch (error: any) {
    if(error){
      return error;
    }
    throw new Error(error);
  }
};