import { Dispatch, SetStateAction } from "react";

export type FunctionDispatch<T> = Dispatch<SetStateAction<T>>;
export type CustomFormType = IInputsLogin | IInputsRegistrationProvider;

// Registration
export interface IInputsRegistrationProvider {
  phone_number: string;
  mersis: number;
  inspection: number;
  first_name: string;
  last_name: string;
  address: string;
  company: string;
  username: string;
  password: string;
  email: string;
  code:string;
}
export interface IInputsLogin {
  password: string;
  email: string;
  phone_login_number: string;
  phone_number: string;
}

export interface ILogin{
  password: string;
  phone_number: string;
}
//ResetPassword
export interface IResetPassword{
  email: string;
  phone_number: string;
}


// Orders
export interface IOrderProduct {
  id: number;
  name: string;
  description: string;
  image: string;
  vendor_code: string;
  amount: number;
  compound: string;
  price: string;
  season: string;
  pattern: string;
  slug: string;
  is_famous: boolean;
  brand: number;
  color: number;
  manufacturerCountry: number;
  size: number;
  subTypes: number[];
}
export interface IUserOrderProduct {
  id: number;
  product: IOrderProduct;
  amount: number;
  order: number;
}
export interface IUserOrdersState {
  id: number;
  order_products: IUserOrderProduct[];
  address: string;
  payment_method: "BT" | "CC" | "COD" | "Other";
  status: string;
  created_date: string;
  total_sum: string;
  user: number;
}
export interface IProvidersOrders {
  id: number;
  order_products: OrderProduct[];
  customer: Customer;
  address: string;
  payment_method: string;
  status: string;
  created_date: string;
  total_sum: string;
}

// Products
export interface IProvidersGoods {
  id: number;
  article_number: number;
  date_and_time: string;
  images: { image_url: string; image_file: null }[];
  price: number;
  name: string;
  status: string;
  compound: string;
  slug: string;
}

// Provider News
export interface IProviderNewsObj {
  id: number;
  image: string;
  title: string;
  text: string;
  data: string;
}

// Notifications
export interface IProvidersNotificationsResult {
  id: number;
  product: {
    name: string;
    description: string;
    compound: string;
    slug: string;
  };
  old_status: string;
  new_status: string;
  changed_at: string;
  provider: number;
}


export interface IProvidersNotifications {
  count: number | null;
  next: string | null;
  previous: string | null;
  results: IProvidersNotificationsResult[];
}

// Registration Services
export interface IPostRegistrationProvider {
  user: {
    password: string;
    first_name: string;
    last_name: string;
    email: string;
   phone_number: string;
  };
  country: string;
  company: string;
  address: string;
  state: "M" | "F" | "C" | "B";
  taxpayer_identification_number: string;
  bank_account_number: {
    number: string;
  };
}

// Additional Interfaces
interface Product {
  id: number;
  name: string;
  description: string;
  compound: string;
  images: { image_url: string; image_file: null }[];
  slug: string;
  price: string;
}
export interface Color {
  id: number;
  slug: string;
  color: string;
  amount: number;
}
interface Size {
  id: number;
  name: string;
}
interface User {
  email: string;
}
interface Customer {
  user: User;
  phone_number: string;
}
export interface IProductEditPage {
  id: number;
  brand: {
    id: number;
    image: string;
    name: string;
  };
  colors_data:Color[];
  sizes_data: {
    id: number;
    name: string;
    amount: number;
  }[];
  manufacturerCountry: {
    id: number;
    name: string;
    slug: string;
  };
  subTypes: {
    id: number;
    name: string;
    type: number;
  }[];
  images: { image_url: string; image_file: null | string }[];
  name: string;
  description: string;
  article_number: string;
  amount: number;
  compound: string;
  price: string;
  season: string;
  pattern: string;
  slug: string;
  is_famous: boolean;
  date_and_time: string;
}
export interface IInputsLength {
  phone_number: number;
  phone_login_number: number;
  password: number;
  first_name: number;
  last_name: number;
  email: number;
  address: number;
  company: number;
  mersis: number;
  inspection: number;
  season: number;
  compound: number;
  article: number;
  brand: number;
  pattern: number;
  country: number;
  name: number;
  price: number;
  size:number; 
  code: number;
}
export interface OrderProduct {
  amount: number;
  product: Product;
  color: Color;
  size: Size;
  sum: number;
}
