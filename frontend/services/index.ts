import axios from "axios";
import { postTokenRefresh } from "./authAPI";

const baseURL = process.env.NEXT_PUBLIC_URL;

const $host = axios.create({ baseURL });

const $authHost = axios.create({ baseURL });

const authorizationInterceptor = (config: any) => {
  const accessToken = localStorage.getItem("AuthTokenMis");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
};

$authHost.interceptors.request.use(authorizationInterceptor);

axios.interceptors.request.use(
  async config => {
    await postTokenRefresh();

    const accessToken = localStorage.getItem("AuthTokenMis");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export { $host, $authHost };
