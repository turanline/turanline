import { $authHost, $host, clearTokens } from "./index";
import { setCookie } from "cookies-next";
//Types
import { IPostRegistrationProvider, ILogin } from "@/types/additionalTypes";




export const postRegistration = async (userInformation: IPostRegistrationProvider) => {
  try {
    const { data, status } = await $host.post(`/api/provider/`, userInformation);


    if (status === 200) {
      setCookie("AuthTokenMis", data.access);
      setCookie("AuthTokenMisRef", data.refresh);
    }

    return { data, status };
  } catch (error) {
    console.log(error)
    throw new Error(`${error}`);
  }
};
export const postLogOut = async (refreshToken: string) => {
  try {
    const { data } = await $authHost.post("/api/token/logout/", { refresh: refreshToken, });

    return data;
  } catch (error) {
    console.error(error);
  }
};
export const getUserData = async (id: number) => {
  try {
    const { data } = await $authHost.get(`/api/provider/${id}`);

    return data;
  } catch (error) {
    console.error(error);
  }
};
export const getProviderBalance = async () => {
  try {
    const { data } = await $authHost.get("/api/provider/get_balance/");

    return data;
  } catch (error) {
    console.error(error);
  }
};
export const postLogIn = async (userData: ILogin) => {
  try {
    const { data, status } = await $host.post("/api/token/", userData);

    if (status === 200) {
      setCookie("AuthTokenMis", data.access);
      setCookie("AuthTokenMisRef", data.refresh);
      setCookie("test", 2);

    }
    return data;

  } catch (error: any) {
    clearTokens();
    throw new Error(error.response.status);
  }
};

