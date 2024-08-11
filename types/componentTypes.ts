//Global
import { Dispatch, SetStateAction } from "react";
import { ICartState } from "./reduxTypes";
import { IInputsLength } from "./types";
import { UseFormRegister } from "react-hook-form";

interface Image {
  image_url: string;
  image_file: string;
}

interface Brand {
  id: number;
  name: string;
  image: string;
}

interface Product {
  id: number;
  name: string;
  images: Image[];
  slug: string;
  price: string;
}

interface ManufacturerCountry {
  id: number;
  name: string;
}

interface CartSize {
  id: number;
  name: string;
}

export interface Color {
  id: number;
  slug: string;
  color: string;
  amount: number;
}

export interface Size {
  amount: number;
  name: string;
  id: number;
}

export interface IProductCart {
  id: number;
  amount: number;
  product: Product;
  color: Color;
  size: CartSize;
  images: Image[];
  sum: string;
}

export interface IProductMainPage {
  id: number;
  name: string;
  description: string;
  compound: string;
  brand: Brand;
  colors_data: Color[];
  sizes_data: Size[];
  manufacturerCountry: ManufacturerCountry;
  category: any[];
  images: Image[];
  article_number: string;
  amount: number;
  price: number;
  season: string;
  pattern: string;
  weight: number;
  slug: string;
  is_famous: boolean;
  status: string;
  date_and_time: string;
  provider: number;
}

export interface IUserOrderItem {
  amount: number;
  color: IProductCart["color"];
  size: IProductCart["size"];
  product: IProductCart["product"];
}

export interface IUserOrderProduct {
  id: number;
  product: IOrderProduct;
  amount: number;
  order: number;
}

export interface IUserOrderWrapper {
  orderNumber: number | null;
  orderDate: string;
  orderStatus: ICartState["cart"]["status"];
  orderProducts: IProductCart[];
  orderSum: string | null;
}

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

export interface IUserReviewItemProps {
  reviewStatus: "published" | "moderation";
  reviewTitle: string;
  reviewText: string;
}

export interface IEmptyComponentProps {
  title: string;
  text: string;
  route: string;
  buttonText: string;
}

export interface IModalChangeProps {
  setIsChange: Dispatch<SetStateAction<boolean>>;
  isChange: boolean;
}

export interface ISearchModalProps extends IHeaderSearchProps {
  setSearchModal: Dispatch<SetStateAction<boolean>>;
  searchModal: boolean;
}

export interface IHeaderSearchProps {
  category: string;
  onSetCategory: (category: string) => void;
  isHidden: boolean;
  allCategories: {
    id: number;
    name: string;
  }[];
}

export interface IProductPageProducts {
  isSimilar: boolean;
  products: IProductMainPage[];
}

export interface ISortConfig {
  key: "created_date" | "total_sum";
  direction: "desc" | "asc";
}
export interface Country {
  code: string;
  flag: string;
  name: string;
}
export interface IModalForgetPassword {
  setForgetModal: Dispatch<SetStateAction<boolean>>;
  forgetModal: boolean;
}

export interface IPrefixConfig {
  code: string;
  name: string;
  flag: string;
  phone_mask: string;
}

export interface PrefixMaskProps {
  onClickFunction: (item: IPrefixConfig) => void;
  properties: (inputType: keyof IInputsLength) => ReturnType<UseFormRegister<IInputsLength>>;
  setSelectPhone:Dispatch<SetStateAction<string>>;
}

export interface ICurrentCategory {
  id: number;
  name: string;
}
export interface Country {
  code: string;
  flag: string;
  name: string;
}