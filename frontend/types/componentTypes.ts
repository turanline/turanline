//Global
import { Dispatch, SetStateAction } from "react";

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
  name: string;
  color: string;
}

export interface Size {
  amount: number;
  size: string;
  size_id: number;
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
  color: Color[];
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

export interface IUserOrderProduct {
  id: number;
  product: IOrderProduct;
  amount: number;
  order: number;
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

export interface IUserOrdersState {
  id: number;
  order_products: IUserOrderProduct[];
  address: string;
  payment_method: "BT" | "CC" | "COD" | "Other";
  status: "processing" | "delivered";
  created_date: string;
  total_sum: string;
  user: number;
}

export interface IUserOrderWrapperProps {
  orderNumber: number;
  orderDate: string;
  orderPrice: string;
  orderStatus: IUserOrdersState["status"];
}

export interface IUserReviewItemProps {
  reviewStatus: "published" | "moderation";
  reviewTitle: string;
  reviewText: string;
}

export interface IUserOrderItemProps {
  cardTitle: string;
  cardPrice: number;
  cardSize: string;
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
