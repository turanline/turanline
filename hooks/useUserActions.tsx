"use client";
//Global
import { showToastMessage } from "@/app/toastsChange";
import { Dispatch, SetStateAction, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UseFormReset, UseFormSetValue } from "react-hook-form";
//Components
import { Icons } from "@/components/Icons/Icons";
import { EmptyComponent } from "@/components/EmptyComponent/EmptyComponent";
import { UserOrderWrapper } from "@/components/UserOrderWrapper/UserOrderWrapper";
import { UserReviewItem } from "@/components/UserReviewItem/UserReviewItem";
//Actions
import {
  getUser,
  logInUser,
  registrationUser,
  changeUserDataProfile,
  getOrders,
  getReviews,
  logOutUser,
  setRegistrationPageNumber,
  setForgetPassword,
  setPaymenPageNumber,
} from "@/redux/reducers/userSlice";
//Hooks
import { useAppDispatch } from "./useReduxHooks";
import { useFavorites } from "./useFavorites";
import { useTranslate } from "./useTranslate";
import { useCart } from "./useCart";
import { useTypedSelector } from "./useReduxHooks";
//Utils
import { CATALOG_ROUTE } from "@/utils/Consts";
//Global Types
import {
  IChangeUserData,
  IInputsChangeProfile,
  IInputsLoginPost,
} from "@/types/types";
//Component Types
import { ISortConfig } from "@/types/componentTypes";
//Redux Types
import { ICartState, IUserInformationApi } from "@/types/reduxTypes";
import { IOrderProduct } from "@/types/componentTypes";

interface IUserReviewState {
  id: number;
  product: IOrderProduct;
  text: string;
  created_datetime: string;
  user: number;
}
interface IUserState {
  userState: IUserInformationApi | null;
  userReviews: IUserReviewState[];
  userOrders: ICartState["cart"][];
  isAuth: boolean;
  status: "pending" | "fulfilled";
}

const useUserActions = () => {
  //Hooks
  const { push } = useRouter();
  const translate = useTranslate();
  const { onResetCart } = useCart();
  const dispatch = useAppDispatch();
  const { onResetFavorites } = useFavorites();
  const { userOrders } = useTypedSelector((state) => state.user);

  const onLogInUser = useCallback(
    (information: IInputsLoginPost) => dispatch(logInUser(information)),
    [dispatch]
  );

  const onRegistrationUser = useCallback(
    (information: IUserInformationApi) =>
      dispatch(registrationUser(information)),
    [dispatch]
  );

  const onSetRegistrationPage = useCallback(
    (page: number) => dispatch(setRegistrationPageNumber(page)),
    [dispatch]
  );

  const onSetPaymenPageNumber = useCallback(
    (page: number) => dispatch(setPaymenPageNumber(page)),
    [dispatch]
  );

  const onSetForgetPassword = useCallback(
    (forget: boolean) => dispatch(setForgetPassword(forget)),
    [dispatch]
  );

  const onChangeUserData = useCallback(
    (newUserData: IChangeUserData) =>
      dispatch(changeUserDataProfile(newUserData)),
    [dispatch]
  );

  const onGetUser = useCallback(() => dispatch(getUser()), [dispatch]);
  const onGetOrders = useCallback(() => dispatch(getOrders()), [dispatch]);
  const onGetReviews = useCallback(() => dispatch(getReviews()), [dispatch]);

  const onLogOutUser = useCallback(async () => {
    try {
      const response = await dispatch(logOutUser());
      if (response.meta.requestStatus === "fulfilled") {
        showToastMessage("success", translate.messageLogOutSuccess);
        onResetCart();
        onResetFavorites();
      }
    } catch (error) {
      console.error(error);
    }
  }, [dispatch, onResetCart, onResetFavorites]);

  const returnUserOrders = (
    orders: ICartState["cart"][],
    handleSort: (key: ISortConfig["key"]) => void
  ) => {
    if (!userOrders?.length) {
      return (
        <EmptyComponent
          buttonText={translate.emptyBasketButtonText}
          route={CATALOG_ROUTE}
          text={translate.profileOrdersText}
          title={translate.profileOrdersTitle}
        />
      );
    }

    return (
      <div className="profile-content_orders-content">
        <div className="profile-content_orders-content-filters">
          <button
            data-name
            className="profile-content_orders-content-filters-button"
          >
            {translate.userActionsTitle}
          </button>

          <button
            data-date
            onClick={() => handleSort("created_date")}
            className="profile-content_orders-content-filters-button"
          >
            {translate.userActionsDate}
            <Icons id="arrowDownProfile" />
          </button>

          <button
            data-price
            onClick={() => handleSort("total_sum")}
            className="profile-content_orders-content-filters-button"
          >
            {translate.userActionsCost}
            <Icons id="arrowDownProfile" />
          </button>

          <button
            data-status
            className="profile-content_orders-content-filters-button"
          >
            {translate.userActionsStatus}
          </button>
        </div>

        <div className="profile-content_orders-content-list">
          {orders?.map((order) => (
            <UserOrderWrapper
              key={order?.id}
              orderNumber={order?.id}
              orderDate={order?.created_date}
              orderStatus={order?.status}
              orderProducts={order?.order_products}
              orderSum={order?.total_sum}
            />
          ))}
        </div>
      </div>
    );
  };

  const returnUserReviews = (reviews: IUserState["userReviews"]) => (
    <>
      {!reviews?.length ? (
        <EmptyComponent
          buttonText={translate.emptyBasketButtonText}
          route={CATALOG_ROUTE}
          text={translate.profileReviewsText}
          title={translate.profileReviewsTitle}
        />
      ) : (
        <div className="profile-content_reviews-list">
          {reviews?.map((review) => (
            <UserReviewItem
              key={review.id}
              reviewStatus="published"
              reviewText={review.text}
              reviewTitle={review.product.name}
            />
          ))}
        </div>
      )}
    </>
  );

  return {
    onLogInUser,
    onRegistrationUser,
    onGetUser,
    onChangeUserData,
    onGetOrders,
    onGetReviews,
    onLogOutUser,
    returnUserOrders,
    returnUserReviews,
    onSetRegistrationPage,
    onSetForgetPassword,
    onSetPaymenPageNumber,
  };
};

export { useUserActions };
