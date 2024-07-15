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
  fetchCart as onFetchCart,
  resetCart,
} from "@/redux/reducers/cartSlice";

// Utils
import { CATALOG_ROUTE, LOGIN_ROUTE, ORDER_ROUTE } from "@/utils/Consts";

// Hooks
import { useTranslate } from "./useTranslate";
import { useAppDispatch, useTypedSelector } from "./useReduxHooks";

// Global Types
import { IPostCartApi } from "@/types/types";

// Component Types
import { IProductCart } from "@/types/componentTypes";

const useCart = () => {
  const { cart } = useTypedSelector(state => state.cart),
    { isAuth } = useTypedSelector(state => state.user);

  const dispatch = useAppDispatch();

  const { push } = useRouter();

  const {
    messageCartError,
    messageCounterDec,
    messageCounterInc,
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

  const fetchCart = useCallback(
    () =>
      dispatch(onFetchCart())
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

  const changeCounter = (action: "inc" | "dec", product: IProductCart) => {
    const increment = action === "inc",
      newAmount = product.amount + (increment ? 1 : -1);

    if (newAmount < 1 || newAmount > product.product.amount) return;

    dispatch(
      changeItemCounter({
        amount: newAmount,
        productId: product.id,
      })
    ).then(data => {
      if ("error" in data && data.error.message === "Rejected")
        showToastMessage("error", messageCartError);
    });

    if (newAmount === 1 && !increment) {
      showToastMessage("warn", messageCounterDec);
      return;
    }

    if (newAmount === product.product.amount && increment) {
      showToastMessage("warn", `${messageCounterInc} ${newAmount}!`);
      return;
    }
  };

  const onChangeCardCounter = useCallback(
    (action: "inc" | "dec", product: IProductCart) => {
      changeCounter(action, product);
    },
    [changeCounter]
  );

  const addItemToCart = useCallback(
    (obj: IPostCartApi) => {
      if (!isAuth) {
        showToastMessage("warn", messageCartNotAuth);
        push(LOGIN_ROUTE);
        return;
      }

      const itemInCart = cart.find(item => item.product.id === obj.product);

      if (!itemInCart) {
        if (!obj.color || !obj.size) {
          showToastMessage("warn", "Вы не выбрали размер или цвет!");
          return;
        }

        dispatch(addToCart(obj))
          .then(data => {
            if ("error" in data && data.error.message === "Rejected") {
              showToastMessage("error", messageCartAddedError);
              return;
            }

            onFetchCart();
            showToastMessage("success", messageCartAdded);
          })
          .catch(error => console.error(error));
        return;
      }

      showToastMessage("warn", messageCartItemInCart);
    },
    [cart, dispatch, fetchCart, push]
  );

  const deleteCardFromBasket = useCallback(
    (id: number) => {
      dispatch(deleteFromCart(id))
        .then(data => {
          if ("error" in data && data.error.message === "Rejected") {
            showToastMessage(
              "success",
              "Произошла ошибка при удалении товара, попробуйте позже!"
            );
            return;
          }

          showToastMessage("success", messageCartDeleted);
        })
        .catch(error => console.error(error));
    },
    [dispatch]
  );

  const onResetCart = useCallback(() => dispatch(resetCart()), [dispatch]);

  const calculateTotalPrice = useCallback((): number => {
    return cart.reduce((totalPrice, item) => {
      const itemPrice = +item.product.price * item.amount;

      return totalPrice + itemPrice;
    }, 0);
  }, [cart]);

  const returnAllProductsCounter = useCallback((): number => {
    return cart.reduce((total, currentItem) => total + currentItem.amount, 0);
  }, [cart]);

  const renderUserCart = useCallback(
    () =>
      cart.length ? (
        <>
          <h5 className="text-[24px]">{headerCart}</h5>
          <div className="flex flex-col gap-[23px]">
            {cart.map(item => (
              <UserCartItem product={item} key={item.id} />
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
              <p className="text-[24px]">
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
    [cart, calculateTotalPrice]
  );

  return {
    fetchCart,
    onChangeCardCounter,
    calculateTotalPrice,
    addItemToCart,
    deleteCardFromBasket,
    returnAllProductsCounter,
    onResetCart,
    renderUserCart,
  };
};

export { useCart };
