import { StaticImageData } from "next/image";
import { Dispatch, SetStateAction } from "react";

export type FunctionDispatch<T> = Dispatch<SetStateAction<T>>;
export type CustomFormType = IInputsLogin | IInputsRegistrationProvider;



export interface loginProps {
  rememberMe: boolean;
  selectPhone: string;
  prefixCode: string;
}

export interface registrationProps {
  phone_number: string;
  selectPhoneRegistration: string;
  nextStep: () => void;
}


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
  verification_code: string;
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
  article_number: string;
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
  sum_for_period: string;
}

export interface GoodInformationBase {
  name: string;
  price: string;
  description: string;
  article: string;
  compound: string;
  season: string;
  pattern: string;
  country: {
    id: number;
    name: string;
  }
  weight: string;
  mold: string;
  material:string;
}

export interface GoodInformationCreate extends GoodInformationBase {
  // Для создания продукта бренд не нужен
  brand?: never;
}

export interface GoodInformationEdit extends GoodInformationBase {
  // При редактировании бренд обязателен
  brand: string;
  category: string;
}

export interface ProductFormArguments<T extends GoodInformationBase> {
  images: (string | null)[];
  setImages: Dispatch<SetStateAction<(string | null)[]>>;
  isActiveFormGood: boolean;
  uploadedImageCount: number;
  setUploadedImageCount: Dispatch<SetStateAction<number>>;
  goodSizesClothes: { [key: string]: number };
  setGoodSizesClothes: Dispatch<SetStateAction<{ [key: string]: number }>>;
  productColors: Color[];
  setProductColors: Dispatch<SetStateAction<Color[]>>;
  goodInformation: T;
  setGoodInformation: Dispatch<SetStateAction<T>>;
}



// Products
export interface IProvidersGoods {
  id: number;
  article_number: string;
  date_and_time: string;
  images: { image_url: string; image_file: null }[];
  price: number;
  name: string;
  status: string;
  compound: string;
  slug: string;
  category: {
    id:number;
    slug: string;
    name:string;
    image: string;
    level:number;
    parent:number;
  };
}

// Provider News
export interface IProviderNewsObj {
  id: number;
  image: string;
  title: string;
  text: string;
  date: string;
  category: string;
}

// Notifications
export interface IProvidersNotificationsResult {
  id: number;
  product: {
    name: string;
    description: string;
    compound: string;
    slug: string;
    article_number:string;
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
  article_number:string;
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
  phone_number: string;
}
interface Customer {
  user: User;
}
export interface IProductEditPage {
  id: number;
  brand: string;
  material: string;
  colors_data:Color[];
  provider:{
    address: string;
    company: string;
    country: string;
  }
  sizes_data: {
    id: number;
    name: string;
    amount: number;
  }[];
  manufacturerCountry:{
    id: number;
    name:string;
    slug:string;
  }
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
  weight: string;
  mold: string;
  category: {
    name:string
  };
}
export interface IInputsLength {
  weight:number;
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
  description: number;
  clothesSize:number;
}
export interface OrderProduct {
  amount: number;
  product: Product;
  color: Color;
  size: Size;
  sum: number;
}
