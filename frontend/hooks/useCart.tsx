"use client";

//Global
import { showToastMessage } from "@/app/toastsChange";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

//Actions
import {
  addToCart,
  changeItemCounter,
  deleteFromCart,
  fetchCart as onFetchCart,
  resetCart,
} from "@/redux/reducers/cartSlice";

//Utils
import { LOGIN_ROUTE } from "@/utils/Consts";

//Hooks
import { useTranslate } from "./useTranslate";
import { useAppDispatch } from "./useAppDispatch";
import { useTypedSelector } from "./useTypedSelector";

//Types
import { IProductCart, IProductMainPage } from "@/types/types";

const useCart = () => {
  const { cart } = useTypedSelector(state => state.cart);

  const dispatch = useAppDispatch();

  const {
    messageCartError,
    messageCounterDec,
    messageCounterInc,
    messageCartAdded,
    messageCartAddedError,
    messageCartDeleted,
    messageCartItemInCart,
    messageCartNotAuth,
  } = useTranslate();

  const { push } = useRouter();

  const fetchCart = useCallback(() => dispatch(onFetchCart()), [dispatch]);

  const onChangeCardCounter = async (
    action: "inc" | "dec",
    product: IProductCart
  ) => {
    if (action === "inc" && product.amount < product.product.amount) {
      dispatch(
        changeItemCounter({
          amount: product.amount + 1,
          productId: product.id,
        })
        // eslint-disable-next-line no-console
      ).catch(error => console.error(messageCartError, error));
    } else if (action === "dec" && product.amount > 1) {
      dispatch(
        changeItemCounter({
          amount: product.amount - 1,
          productId: product.id,
        })
      ).catch(error =>
        // eslint-disable-next-line no-console
        console.error("Ошибка при изменении счетчика на сервере:", error)
      );
    }

    if (product.amount === 1 && action === "dec")
      showToastMessage("warn", messageCounterDec);

    if (product.amount === product.product.amount && action === "inc")
      showToastMessage("warn", `${messageCounterInc} ${product.amount}!`);
  };

  const addItemToCart = async (
    productInfo: IProductMainPage,
    amount: number,
    isAuth: boolean
  ) => {
    if (isAuth) {
      const itemInCart = cart.find(item => item.product.id === productInfo.id);

      if (!itemInCart) {
        dispatch(addToCart({ amount, product: productInfo.id }))
          .then(() => fetchCart())
          .then(() => showToastMessage("success", messageCartAdded))
          .catch(() => showToastMessage("error", messageCartAddedError));
      } else showToastMessage("warn", messageCartItemInCart);
    } else {
      showToastMessage("warn", messageCartNotAuth);
      push(LOGIN_ROUTE);
    }
  };

  const deleteCardFromBasket = async (id: number) => {
    dispatch(deleteFromCart(id))
      .then(() => showToastMessage("success", messageCartDeleted))
      // eslint-disable-next-line no-console
      .catch(error => console.log(error));
  };

  const onResetCart = () => dispatch(resetCart());

  const calculateTotalPrice = (): number => {
    let totalPrice = 0;

    cart.forEach(item => {
      const { product, amount } = item,
        itemPrice = +product.price * amount;
      totalPrice += itemPrice;
    });

    return totalPrice;
  };

  const returnAllProductsCounter = () => {
    return cart.reduce((total, currentItem) => total + currentItem.amount, 0);
  };

  return {
    fetchCart,
    onChangeCardCounter,
    calculateTotalPrice,
    addItemToCart,
    deleteCardFromBasket,
    returnAllProductsCounter,
    onResetCart,
  };
};

export { useCart };
