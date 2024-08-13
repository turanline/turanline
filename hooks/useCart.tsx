"use client";

// Global
import { showToastMessage } from "@/app/toastsChange";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import Link from "next/link";

// Components
import { Button } from "@nextui-org/react";
import { UserCartItem } from "@/components/userCartItem/UserCartItem";
import { EmptyComponent } from "@/components/EmptyComponent/EmptyComponent";

// Actions
import {
  addToCart,
  changeItemCounter,
  deleteFromCart,
  fetchCart,
  resetCart,
} from "@/redux/reducers/cartSlice";

// Utils
import { CATALOG_ROUTE, LOGIN_ROUTE, ORDER_ROUTE } from "@/utils/Consts";

// Hooks
import { useTranslate } from "./useTranslate";
import { useAppDispatch, useTypedSelector } from "./useReduxHooks";

// Global Types
import { IPostCartApi } from "@/types/types";
import { postUserOrder } from "@/services/cartAPI";

const useCart = () => {
  const { cart } = useTypedSelector(state => state.cart),
    { isAuth } = useTypedSelector(state => state.user);

  const dispatch = useAppDispatch();

  const { push } = useRouter();

  const {
    messageCartError,
    messageCartAdded,
    messageCartAddedError,
    messageCartDeleted,
    messageCartItemInCart,
    messageCartNotAuth,
    cartContinue,
    cartTotalPriceText,
    emptyBasketButtonText,
    emptyBasketText,
    emptyBasketTitle,
    headerCart,
  } = useTranslate();

  const onFetchCart = useCallback(
    () =>
      dispatch(fetchCart())
        .then(data => {
          if ("error" in data && data.error.message === "Rejected")
            showToastMessage(
              "error",
              "Произошла ошибка при получении корзины корзины, попробуйте позже!"
            );
        })
        .catch(error => console.error(error)),
    [dispatch]
  );

  const onChangeCardCounter = useCallback(
    (obj: Omit<IPostCartApi, "product">, id: number) =>
      dispatch(changeItemCounter({ options: obj, id }))
        .then(data => {
          if ("error" in data && data.error.message === "Rejected") {
            showToastMessage("error", messageCartError);
            return;
          }
        })
        .catch(error => console.error(error)),
    [dispatch]
  );

  const addItemToCart = useCallback(
    (obj: IPostCartApi) => {
      if (!isAuth) {
        showToastMessage("warn", messageCartNotAuth);
        push(LOGIN_ROUTE);
        return;
      }

      const itemInCart = cart?.order_products?.find(
        item =>
          item.product.id === obj.product &&
          item.color.id === obj.color
      );

      if (itemInCart) {
        showToastMessage("warn", messageCartItemInCart);
        return;
      }

      if (!obj.color) {
        showToastMessage("warn", "Вы не выбрали цвет!");
        return;
      }

      return dispatch(addToCart(obj))
        .then(data => {
          if ("error" in data && data.error.message === "Rejected") {
            showToastMessage("error", messageCartAddedError);
            return;
          }

          onFetchCart();
          showToastMessage("success", messageCartAdded);
        })
        .catch(error => console.error(error));
    },
    [cart, dispatch, fetchCart, push]
  );

  const deleteCardFromBasket = useCallback(
    (id: number) => {
      dispatch(deleteFromCart(id))
        .then(data => {
          if ("error" in data && data.error.message === "Rejected") {
            showToastMessage(
              "error",
              "Произошла ошибка при удалении товара, попробуйте позже!"
            );
            return;
          }

          onFetchCart();
          showToastMessage("success", messageCartDeleted);
        })
        .catch(error => console.error(error));
    },
    [dispatch]
  );

  const onResetCart = useCallback(() => dispatch(resetCart()), [dispatch]);

  const calculateTotalPrice = (): number => {
    let totalPrice = 0;

    cart.order_products.forEach(item => {
      const { product, amount } = item,
        itemPrice = +product.price * amount;

      totalPrice += itemPrice;
    });

    return totalPrice;
  };

  const returnAllProductsCounter = useCallback((): number => {
    return cart.order_products.reduce(
      (total, currentItem) => total + currentItem.amount,
      0
    );
  }, [cart]);

  // const onPostUserOrder = async (obj: any) => {
  //   await postUserOrder(obj)
  //     .then(() => {
  //       showToastMessage("success", "Заказ успешно отправлен!");
  //       onFetchCart();
  //     })
  //     .catch(error => console.error(error));
  // };

  const renderUserCart = useCallback(
    () =>
      cart?.order_products?.length ? (
        <>
          <h5 className="text-[24px] leading-none">{headerCart}</h5>

          <div className="flex flex-col gap-[30px]">
            {cart.order_products.map(item => (
              <UserCartItem product={item} key={item.product.id} />
            ))}

            <div className="basket_confirm">
              <Button className="basket_button bg-tiffani text-white rounded-md w-[278px] h-[51px] py-[10px]">
                <Link
                  className="w-full h-full flex items-center justify-center"
                  href={ORDER_ROUTE}
                >
                  {cartContinue}
                </Link>
              </Button>
              <p className="text-[24px] leading-none">
                {`${cartTotalPriceText} $${calculateTotalPrice().toFixed(2)}`}
              </p>
            </div>
          </div>
        </>
      ) : (
        <EmptyComponent
          title={emptyBasketTitle}
          text={emptyBasketText}
          route={CATALOG_ROUTE}
          buttonText={emptyBasketButtonText}
        />
      ),
    [cart.order_products]
  );

  return {
    onFetchCart,
    onChangeCardCounter,
    addItemToCart,
    deleteCardFromBasket,
    returnAllProductsCounter,
    onResetCart,
    renderUserCart,
    calculateTotalPrice,
    // onPostUserOrder,
  };
};

export { useCart };
