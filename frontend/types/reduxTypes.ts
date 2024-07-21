//Component Types
import { IOrderProduct, IUserOrdersState } from "./componentTypes";

//Component Types
import { IProductCart, IProductMainPage } from "./componentTypes";

interface IUserReviewState {
  id: number;
  product: IOrderProduct;
  text: string;
  created_datetime: string;
  user: number;
}

interface ICart {
  id: number | null;
  order_products: IProductCart[];
  address: string;
  payment_method: "BC" | "CC" | "PP";
  status: "CR" | "CO" | "CA";
  created_date: string;
  total_sum: string | null;
  customer: number | null;
}

interface Category {
  id: number;
  name: string;
  image: string;
  level: number;
  parent: number;
}

export interface ICategoriesState {
  categories: Category[];
  types: Category[];
  subtypes: Category[];
  status: "pending" | "fulfilled";
}

export interface IUserInformationApi {
  user: {
    password: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    is_provider: boolean;
  };
  phone_number: string;
  company: string;
  address: string;
}

export interface IUserState {
  userState: IUserInformationApi | null;
  userReviews: IUserReviewState[];
  userOrders: IUserOrdersState[];
  isAuth: boolean;
  status: "pending" | "fulfilled";
}

export interface ICartState {
  cart: ICart;
  status: "pending" | "fulfilled";
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

export interface IFavoritesState {
  favorites: IProductMainPage[];
  status: "pending" | "fulfilled";
}
