import { $authHost, $host } from "./index";
//Types
import {IPostRegistrationProvider} from "@/types/additionalTypes";

export const postRegistration = async (userInformation: IPostRegistrationProvider) => {
  try {
    const { data } = await $host.post(`/api/provider/`, userInformation);

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};
export const postLogOut = async (refreshToken: string) => {
  try {
    const { data } = await $authHost.post("/api/token/logout/", {refresh: refreshToken,});

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
