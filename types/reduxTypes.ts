//Component Types
import { IOrderProduct } from "./componentTypes";

//Component Types
import { IProductCart, IProductMainPage } from "./componentTypes";



export interface ICart {
  id: number | null;
  order_products: IProductCart[];
  address: string;
  payment_method: "BC" | "CC" | "PP";
  status: "CR" | "CO" | "CA";
  created_date: string;
  total_sum: string | null;
  customer: number | null;
}



export interface IUserInformationApi {
  user: {
    password: string;
    first_name: string;
    last_name: string;
    email: string;
   phone_number: string;
  };
  company: string;
  address: string;
}
export interface IProductsState {
  products: IProductMainPage[];
  filtered: IProductMainPage[];
  category: string;
  status: IFavoritesState["status"];
  searchText: string;
  filters: {
    size: string | null;
    brand: string | null;
    color: string | null;
    lbprice: number | null;
    hbprice: number | null;
  };
}

export interface ICartState {
  cart: ICart;
  status: "pending" | "fulfilled";
}


export interface IFavoritesState {
  favorites: IProductMainPage[];
  status: "pending" | "fulfilled";
}
