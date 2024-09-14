import { Dispatch, SetStateAction } from "react";
import { IUserOrdersState,OrderProduct} from "./additionalTypes";

// export type FunctionDispatch<T> = Dispatch<SetStateAction<T>>;
export interface Country {
  code: string;
  flag: string;
  name: string;
}
// Components
export interface IUserOrderItemProps {
  cardTitle: string;
  cardPrice: string;
  cardSize: string;
  cardColor: string;
  cardAmount: number;
  cardPriceAll: number;
  cardSlug: string;
  cardImg: string | null;
}
export interface IUserReviewItemProps {
  reviewStatus: "published" | "moderation";
  reviewTitle: string;
  reviewText: string;
}
export interface IUserOrderWrapperProps {
  orderNumber: number;
  orderDate: string;
  orderPrice: string;
  orderStatus: IUserOrdersState["status"];
  orderInformation: OrderProduct[];
  setAppealModal: Dispatch<SetStateAction<boolean>>;
  appealModal: boolean;
}
export interface IModalForgetPassword {
  setForgetModal: Dispatch<SetStateAction<boolean>>;
  forgetModal: boolean;
}
export interface IModalAppeal {
  setAppealModal: Dispatch<SetStateAction<boolean>>;
  appealModal: boolean;
  clientEmail: string;
  clientPhone: string;
}
export interface IModalImportProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
export interface IProviderCardProps {
  cardTitle: string;
  cardImage: string | null;
  cardPrice: number;
  cardArticle: number;
  cardDate: string;
  cardTime: string;
  cardStatusText: string;
  cardStatus: string;
  cardCompound: string;
  cardSlug: string;
}