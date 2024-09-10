//Global
import { AxiosError } from "axios";

export type CustomFormType =
  | IInputsLogin
  | IInputsRegistration
  | IInputsChangeProfile
  | IInputsCard;

export interface IPostCartApi {
  amount: number;
  product: number;
  color: number;
}

export interface IChangeUserData {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  };
  company: string;
  address: string;
}

export interface IInputsLength {
  phone_number: number;
  password: number;
  phone_login_number: number;
  first_name: number;
  last_name: number;
  email: number;
  address: number;
  company: number;
  code: number;
  card_number: number;  
  cardholder_name: number;
  cvv: number;
  expiration_month: number;
  expiration_year: number;
}

export interface IInputsCard{
  card_number: number;  
  cardholder_name: number;
  cvv: number;
  expiration_month: number;
  expiration_year: number;
}

export interface IInputsLogin {
  password: string;
  phone_login_number: string;
  email:string;
  phone_number: string;
}

export interface IInputsLoginPost {
  password: string;
  phone_number: string;
}

export interface IResetPassword{
  verification_code: string;
  phone_number: string;
}

export interface IInputsRegistration extends IInputsLogin {
  email: string;
  first_name: string;
  last_name: string;
  code: string;
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
}
