//Global
import { Dispatch, SetStateAction } from "react";

export interface IProductCart {
  id: number;
  product: {
    id: number;
    brand: {
      id: number;
      image: string;
      name: string;
    };
    color: {
      id: number;
      name: string;
      color: string;
    };
    size: {
      id: number;
      name: string;
    };
    manufacturerCountry: {
      id: number;
      name: string;
    };
    subTypes: {
      id: number;
      name: string;
      type: number;
    }[];
    name: string;
    description: string;
    image: string;
    article_number: string;
    amount: number;
    compound: string;
    price: string;
    season: string;
    pattern: string;
    slug: string;
    is_famous: boolean;
    date_and_time: string;
  };
  amount: number;
  date: string;
  order: number;
}

export interface IProductMainPage {
  id: number;
  brand: {
    id: number;
    image: string;
    name: string;
  };
  color: {
    id: number;
    name: string;
    color: string;
  }[];
  size: {
    id: number;
    name: string;
  }[];
  manufacturerCountry: {
    id: number;
    name: string;
  };
  subTypes: {
    id: number;
    name: string;
    type: number;
  }[];
  images: { image_url: string; image_file: null }[];
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
