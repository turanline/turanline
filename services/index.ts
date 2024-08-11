// Global
import axios from "axios";
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
