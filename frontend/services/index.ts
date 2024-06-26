//Global
import axios from "axios";

//Services
import { postTokenRefresh } from "./authAPI";

const baseURL = process.env.NEXT_PUBLIC_URL;

const $host = axios.create({ baseURL });
const $authHost = axios.create({ baseURL });

export const clearTokens = () => {
  localStorage.removeItem("AuthTokenMis");
  localStorage.removeItem("AuthTokenMisRef");
};

$authHost.interceptors.request.use(config => {
  const token = localStorage.getItem("AuthTokenMis");

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

$authHost.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("AuthTokenMisRef");

      if (refreshToken) {
        try {
          const newAccessToken = await postTokenRefresh(refreshToken);

          localStorage.setItem("AuthTokenMis", newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return $authHost(originalRequest);
        } catch {
          // clearTokens();

          return Promise.reject(error);
        }
      }
      // clearTokens();
    }
    if ([403, 500, 401, 404, 400].includes(error.response.status)) {
      // clearTokens();
    }

    return Promise.reject(error);
  }
);

export { $host, $authHost };
