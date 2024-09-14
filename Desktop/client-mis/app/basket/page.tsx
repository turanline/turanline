"use client";

//Global
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

//Components
import Link from "next/link";

//Utils
import {
  BASKET_ROUTE,
  SHOP_ROUTE,
  ORDER_ROUTE,
  CATALOG_ROUTE,
} from "@/utils/Consts";

//Hooks
import { useCart } from "@/hooks/useCart";
import { useTranslate } from "@/hooks/useTranslate";
import { useTypedSelector } from "@/hooks/useTypedSelector";

//Components
import { Breadcrumbs, BreadcrumbItem, Button } from "@nextui-org/react";
import { UserCartItem } from "@/components/userCartItem/UserCartItem";
import { EmptyComponent } from "@/components/EmptyComponent/EmptyComponent";
import { Icons } from "@/components/Icons/Icons";

//Styles
import "swiper/css";
import "./basket.scss";
import "swiper/css/pagination";

export default function Basket() {
  const { isAuth, status: userStatus } = useTypedSelector(state => state.user),
    { cart, status: cartStatus } = useTypedSelector(state => state.cart);

  const { push } = useRouter();

  const {
    emptyBasketButtonText,
    emptyBasketText,
    emptyBasketTitle,
    mainPageRoute,
    headerCart,
    cartContinue,
    cartTotalPriceText,
  } = useTranslate();

  const { calculateTotalPrice } = useCart();

  useEffect(() => {
    if (!isAuth && userStatus === "fulfilled") push(SHOP_ROUTE);
  }, [userStatus, isAuth]);

  if (!isAuth || cartStatus === "pending" || userStatus === "pending")
    return <Icons id="spiner" />;

  return (
    <main className="container mx-auto mt-[30px] mb-[100px] px-[28px] sm:px-0">
      <Breadcrumbs>
        <BreadcrumbItem href={SHOP_ROUTE}>{mainPageRoute}</BreadcrumbItem>

        <BreadcrumbItem href={BASKET_ROUTE}>{headerCart}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="w-full mt-[48px] gap-[23px] flex flex-col">
        {cart.length ? (
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

                <p className="text-[24px]">{`${cartTotalPriceText} $${calculateTotalPrice().toFixed(
                  2
                )}`}</p>
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
        )}
      </div>
    </main>
  );
}
