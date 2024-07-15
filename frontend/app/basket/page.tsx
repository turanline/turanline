"use client";

//Global
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

//Utils
import { BASKET_ROUTE, SHOP_ROUTE } from "@/utils/Consts";

//Hooks
import { useCart } from "@/hooks/useCart";
import { useTranslate } from "@/hooks/useTranslate";
import { useTypedSelector } from "@/hooks/useReduxHooks";

//Components
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { Icons } from "@/components/Icons/Icons";

//Styles
import "swiper/css";
import "./basket.scss";
import "swiper/css/pagination";

export default function Basket() {
  const { isAuth, status: userStatus } = useTypedSelector(state => state.user),
    { status: cartStatus } = useTypedSelector(state => state.cart);

  const { renderUserCart } = useCart();

  const { push } = useRouter();

  const { mainPageRoute, headerCart } = useTranslate();

  useEffect(() => {
    if (!isAuth && userStatus === "fulfilled") push(SHOP_ROUTE);
  }, [userStatus, isAuth, push]);

  if (!isAuth || cartStatus === "pending" || userStatus === "pending")
    return <Icons id="spiner" />;

  return (
    <main className="container mx-auto mt-[30px] mb-[100px] px-[28px] sm:px-0">
      <Breadcrumbs>
        <BreadcrumbItem href={SHOP_ROUTE}>{mainPageRoute}</BreadcrumbItem>

        <BreadcrumbItem href={BASKET_ROUTE}>{headerCart}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="w-full mt-[48px] gap-[23px] flex flex-col">
        {renderUserCart()}
      </div>
    </main>
  );
}
