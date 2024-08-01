//Global
import { AxiosError } from "axios";

export type CustomFormType =
  | IInputsLogin
  | IInputsRegistration
  | IInputsChangeProfile;

export interface IPostCartApi {
  amount: number;
  product: number;
  color: number;
  size: number;
}

export interface IChangeUserData {
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  company: string;
  address: string;
  phone_number: string;
}

export interface IInputsLength {
  phone_number: number;
  password: number;
  username: number;
  first_name: number;
  last_name: number;
  email: number;
  address: number;
  company: number;
}

export interface IInputsLogin {
  password: string;
  username: string;
}

export interface IInputsRegistration extends IInputsLogin {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

export interface IInputsChangeProfile {
  first_name: string;
  last_name: string;
  company: string;
  address: string;
  email: string;
  phone_number: string;
}

export interface IUserResponse {
  status: number;
  error: AxiosError | null | unknown;
}

export interface IPutCart {
  amount: number;
  color: number;
  size: number;
}
