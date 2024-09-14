//Global
import axios from "axios";

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

export { $host, $authHost };
