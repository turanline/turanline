// Global
import axios from "axios";
import { postVerifyToken,postTokenRefresh } from "./authAPI";
//Routes
import { redirect } from "next/navigation";
import { LOGIN_ROUTE } from "@/utils/Consts";
// Cookies
import { deleteCookie, getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_URL;

const $host = axios.create({ baseURL }),
  $authHost = axios.create({ baseURL });

const authorizationInterceptor = (config: any) => {
  const accessToken = getCookie("AuthTokenMis");
  const language = getCookie("selectedLanguage");

  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;

  if (language) config.headers["Accept-Language"] = language;
  else config.headers["Accept-Language"] = "en";

  return config;
};

const unauthorizedInterceptor = (config: any) => {
  const language = getCookie("selectedLanguage");

  if (language) config.headers["Accept-Language"] = language;

  return config;
};

$authHost.interceptors.request.use(authorizationInterceptor);
$host.interceptors.request.use(unauthorizedInterceptor);

export { $host, $authHost };

export const clearTokens = () => {
  deleteCookie("AuthTokenMis");
  deleteCookie("AuthTokenMisRef");
};


//checkTokens
export const verifyAndRefreshToken = async () => {
  // Get all tokens
  const token = getCookie("AuthTokenMis");
  const refreshToken = getCookie("AuthTokenMisRef");

  // Check if the token exists
  if (!token) {
    throw new Error("Токен не найден");
  }

  try {
    const {user,roles} = await postVerifyToken(token);

    switch (true) {
      case roles?.provider && roles?.customer:
          return user;
      case !roles?.customer && roles?.provider:
          redirect(LOGIN_ROUTE);
      case !roles?.provider && roles?.customer:
          return user;
      default:
          break;
  }

  } catch (error) {
    if (refreshToken) {
      try {
        const newToken = await postTokenRefresh();
        const { user } = await postVerifyToken(newToken);


        return user;
      } catch (refreshError) {
        clearTokens();
        throw new Error("Не удалось обновить токен");
      }
    } else {
      clearTokens();
      throw new Error("Токен обновления не найден");
    }
  }
};