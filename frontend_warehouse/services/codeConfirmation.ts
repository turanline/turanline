//Hosts
import { $host } from "./index";
import { setCookie } from "cookies-next";
//Types
import {IResetPassword } from "@/types/additionalTypes";



export const postConfirmCode = async (phone_number: string,verification_code: string) => {
  try {
    const { data,status } = await $host.post("/api/users/compare_verification_code/", {phone_number,verification_code});

    if(status === 200){
      setCookie("AuthTokenMis", data.access);
      setCookie("AuthTokenMisRef", data.refresh);
    }

    return {data,status};
  } catch (error: any) {
    console.error(error);
    return error;
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