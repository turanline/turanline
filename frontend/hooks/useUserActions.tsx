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
} from "@/redux/reducers/userSlice";

//Hooks
import { useAppDispatch } from "./useReduxHooks";
import { useFavorites } from "./useFavorites";
import { useTranslate } from "./useTranslate";
import { useCart } from "./useCart";

//Utils
import { CATALOG_ROUTE, LOGIN_ROUTE, PROFILE_ROUTE } from "@/utils/Consts";

//Global Types
import {
  IChangeUserData,
  IInputsChangeProfile,
  IInputsLogin,
  IInputsRegistration,
} from "@/types/types";

//Component Types
import { ISortConfig } from "@/types/componentTypes";

//Redux Types
import {
  ICartState,
  IUserInformationApi,
  IUserState,
} from "@/types/reduxTypes";

const useUserActions = () => {
  const dispatch = useAppDispatch();

  const { push } = useRouter();

  const { onResetCart } = useCart(),
    { onResetFavorites } = useFavorites();

  const {
    messageLogOutSuccess,
    profileOrdersText,
    profileOrdersTitle,
    emptyBasketButtonText,
    profileReviewsText,
    profileReviewsTitle,
    messageLogInError,
    messageLogInSuccess,
    messageRegistrationError,
    messageRegistration,
    messageModalChangeError,
    messageModalChangeSuccess,
  } = useTranslate();

  const onLogInUser = useCallback(
    (information: IInputsLogin, reset: UseFormReset<IInputsLogin>) =>
      dispatch(logInUser(information))
        .then(data => {
          if ("error" in data && data.error.message === "Rejected") {
            showToastMessage("error", messageLogInError);
            return;
          }

          showToastMessage("success", messageLogInSuccess);
          push(PROFILE_ROUTE);
        })
        .catch(error => console.log(error))
        .finally(() => reset()),
    [dispatch]
  );

  const onRegistrationUser = useCallback(
    (
      information: Omit<IUserInformationApi, "address" | "company">,
      reset: UseFormReset<IInputsRegistration>,
      setValue: UseFormSetValue<IInputsRegistration>
    ) =>
      dispatch(registrationUser(information))
        .then(data => {
          if ("error" in data && data.error.message === "Rejected") {
            showToastMessage("error", messageRegistrationError);
            return;
          }

          showToastMessage("success", messageRegistration);
          push(LOGIN_ROUTE);
        })
        .catch(error => console.error(error))
        .finally(() => {
          setValue("phone_number", "");
          reset();
        }),
    [dispatch]
  );

  const onChangeUserData = useCallback(
    (
      newUserData: IChangeUserData,
      reset: UseFormReset<IInputsChangeProfile>,
      setValue: UseFormSetValue<IInputsChangeProfile>,
      setIsChange: Dispatch<SetStateAction<boolean>>
    ) =>
      dispatch(changeUserDataProfile(newUserData))
        .then(data => {
          if ("error" in data && data.error.message === "Rejected") {
            showToastMessage("error", messageModalChangeError);
            return;
          }
          showToastMessage("success", messageModalChangeSuccess);
          setIsChange(false);
        })
        .catch(error => console.log(error))
        .finally(() => {
          reset();
          setValue("phone_number", "");
        }),
    [dispatch]
  );

  const onGetUser = useCallback(() => dispatch(getUser()), [dispatch]),
    onGetOrders = useCallback(() => dispatch(getOrders()), [dispatch]),
    onGetReviews = useCallback(() => dispatch(getReviews()), [dispatch]);

  const onLogOutUser = useCallback(async () => {
    try {
      await dispatch(logOutUser())
        .then(() => {
          showToastMessage("success", messageLogOutSuccess);
          onResetCart();
          onResetFavorites();
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.error(error);
    }
  }, [dispatch, onResetCart, onResetFavorites]);

  const returnUserOrders = (
    orders: ICartState["cart"][],
    handleSort: (key: ISortConfig["key"]) => void
  ) => {
    if (!orders?.length) {
      return (
        <EmptyComponent
          buttonText={emptyBasketButtonText}
          route={CATALOG_ROUTE}
          text={profileOrdersText}
          title={profileOrdersTitle}
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
            Название
          </button>

          <button
            data-date
            onClick={() => handleSort("created_date")}
            className="profile-content_orders-content-filters-button"
          >
            Дата
            <Icons id="arrowDownProfile" />
          </button>

          <button
            data-price
            onClick={() => handleSort("total_sum")}
            className="profile-content_orders-content-filters-button"
          >
            Стоимость
            <Icons id="arrowDownProfile" />
          </button>

          <button
            data-status
            className="profile-content_orders-content-filters-button"
          >
            Статус
          </button>
        </div>

        <div className="profile-content_orders-content-list">
          {orders?.map(order => (
            <UserOrderWrapper
              key={order.id}
              orderNumber={order?.id}
              orderDate={order?.created_date}
              orderStatus={order?.status}
              orderProducts={order.order_products}
              orderSum={order.total_sum}
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
          buttonText={emptyBasketButtonText}
          route={CATALOG_ROUTE}
          text={profileReviewsText}
          title={profileReviewsTitle}
        />
      ) : (
        <div className="profile-content_reviews-list">
          {reviews?.map(review => (
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
  };
};

export { useUserActions };
