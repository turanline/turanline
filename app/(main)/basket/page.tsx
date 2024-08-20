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
  //Hooks
  const { isAuth, status: userStatus } = useTypedSelector(state => state.user);
  const { status: cartStatus } = useTypedSelector(state => state.cart);
  const { renderUserCart } = useCart();
  const translate = useTranslate();
  const { push } = useRouter();


  useEffect(() => {
    if (!isAuth && userStatus === "fulfilled") push(SHOP_ROUTE);
  }, [userStatus, isAuth, push]);

  if (!isAuth || cartStatus === "pending" || userStatus === "pending")
    return <Icons id="spiner" />;

  return (
    <main className="container mx-auto px-[28px] sm:px-0">
      <Breadcrumbs>
        <BreadcrumbItem href={SHOP_ROUTE}>{translate.mainPageRoute}</BreadcrumbItem>

        <BreadcrumbItem href={BASKET_ROUTE}>{translate.headerCart}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="w-full gap-[30px] mt-[30px] mb-[30px] flex flex-col px-[15px] lg:px-[30px]">
        {renderUserCart()}
      </div>
    </main>
  );
}
