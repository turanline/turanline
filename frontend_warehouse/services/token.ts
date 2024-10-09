import { $authHost, $host } from "./index";
import { setCookie,getCookie } from "cookies-next";

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