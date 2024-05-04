"use client";

//Global
import { useCallback, useEffect, useContext } from "react";
import { showToastMessage } from "@/app/toastsChange";

//Services
import { patchCartItem, getCart, deleteFromCartById } from "@/services/cartAPI";
import { addToCart } from "@/utils/AddToCart";

//Types
import { IProductCart, IProductMainPage, IPutCart } from "@/types/types";

//Context
import { SidebarContext } from "@/app/layout";

const useCart = () => {
  const { isActive, setUserCart, userCart } = useContext(SidebarContext);

  const fetchCart = useCallback(async () => {
    try {
      const cart = await getCart();
      setUserCart(cart);
    } catch (error) {
      showToastMessage("error", "Ошибка при получении корзины");
    }
  }, []);

  useEffect(() => {
    if (isActive) fetchCart();
  }, [isActive, fetchCart]);

  const changeCounterOnServer = async ({ amount, productId }: IPutCart) => {
    try {
      await patchCartItem({ amount, productId });
    } catch (error) {
      throw new Error(`${error}`);
    }
  };

  const onChangeCardCounter = async (
    action: "inc" | "dec",
    product: IProductCart
  ) => {
    const updatedCart = [...userCart];
    const currentElemIndex = userCart.findIndex(item => item.id === product.id);

    if (currentElemIndex !== -1) {
      const currentElem = updatedCart[currentElemIndex];

      if (action === "inc" && currentElem.amount < currentElem.product.amount) {
        await changeCounterOnServer({
          amount: currentElem.amount + 1,
          productId: product.id,
        }).catch(error =>
          console.error("Ошибка при изменении счетчика на сервере:", error)
        );

        updatedCart[currentElemIndex] = {
          ...currentElem,
          amount: currentElem.amount + 1,
        };
      } else if (action === "dec" && currentElem.amount > 1) {
        await changeCounterOnServer({
          amount: currentElem.amount - 1,
          productId: product.id,
        }).catch(error =>
          console.error("Ошибка при изменении счетчика на сервере:", error)
        );

        updatedCart[currentElemIndex] = {
          ...currentElem,
          amount: currentElem.amount - 1,
        };
      }

      if (currentElem.amount === 1 && action === "dec")
        showToastMessage(
          "warn",
          "Счетчик товара не может быть меньше единицы!"
        );

      if (currentElem.amount === currentElem.product.amount && action === "inc")
        showToastMessage(
          "warn",
          `На складе есть только ${currentElem.amount} таких товаров!`
        );

      setUserCart(updatedCart);
    }
  };

  const addItemToCart = async (
    productInfo: IProductMainPage,
    amount: number
  ) => {
    if (!isActive) showToastMessage("warn", "Вы не авторизованы !");

    const serverCart: IProductCart[] = await getCart(),
      itemInCart = serverCart.find(item => item.product.id === productInfo.id);

    if (!itemInCart) {
      addToCart({ amount, product: productInfo.id })
        .then(() => fetchCart())
        .catch(error => console.log(error));
    } else {
      showToastMessage("warn", "Этот товар уже в корзине!");
    }
  };

  const deleteCardFromBasket = async (id: number) => {
    try {
      deleteFromCartById(id)
        .then(() => showToastMessage("success", "Товар удалён из корзины"))
        .then(() => setUserCart(prev => prev.filter(item => item.id !== id)))
        .catch(error => {
          if (error.response && error.response.data) {
            const responseData = error.response.data;

            Object.keys(responseData).forEach(key => {
              const errorMessage = responseData[key][0];
              showToastMessage("error", errorMessage);
            });
          } else {
            showToastMessage(
              "error",
              "Произошла ошибка, но не удалось получить дополнительные данные об ошибке"
            );
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const calculateTotalPrice = (): number => {
    let totalPrice = 0;

    userCart.forEach(item => {
      const { product, amount } = item;
      const itemPrice = product.price * amount;
      totalPrice += itemPrice;
    });

    return totalPrice;
  };

  return {
    fetchCart,
    onChangeCardCounter,
    calculateTotalPrice,
    addItemToCart,
    deleteCardFromBasket,
  };
};

export { useCart };
