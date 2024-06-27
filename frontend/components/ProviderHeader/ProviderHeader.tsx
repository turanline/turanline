"use client";

//Global
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

//Utils
import {
  PROVIDER_ROUTE,
  PROVIDER_PRODUCTS_ROUTE,
  PROVIDER_ORDERS_ROUTE,
  SHOP_ROUTE,
} from "@/utils/Consts";

//Components
import { Button, Tooltip } from "@nextui-org/react";

//Images
import logo from "@/public/assets/other/logo2.svg";

//Hooks
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useTranslate } from "@/hooks/useTranslate";
import { useUserActions } from "@/hooks/useUserActions";

//Styles
import "./ProviderHeader.scss";

export const ProviderHeader = () => {
  const { providerState } = useTypedSelector(state => state.user);

  const { headerToProfile, profilePageLogOut } = useTranslate();

  const { onLogOutUser } = useUserActions();

  const { push } = useRouter();

  const buttonStyles = {
    backgroundColor: "transparent",
    borderRadius: 0,
    width: "100%",
  };

  return (
    <nav className="provider-page_header">
      <div className="provider-page_header-content">
        <Link href={SHOP_ROUTE}>
          <Image src={logo} alt="logo" />
        </Link>

        <div className="provider-page_header-links">
          <Link href="#">Партнеры</Link>

          <Link href={PROVIDER_ROUTE}>Главная</Link>

          <Link href={PROVIDER_PRODUCTS_ROUTE}>Товары и цены</Link>

          <Link href={PROVIDER_ORDERS_ROUTE}>Заказы и отзывы</Link>
        </div>

        <Tooltip
          classNames={{ content: "p-0 overflow-hidden" }}
          content={
            <div className="flex flex-col items-center">
              <Button
                className="h-[40px] flex items-center"
                onClick={() => push(PROVIDER_ROUTE)}
                style={buttonStyles}
              >
                {headerToProfile}
              </Button>

              <Button onClick={onLogOutUser} style={buttonStyles}>
                {profilePageLogOut}
              </Button>
            </div>
          }
          className="flex flex-col items-center justify-between"
        >
          <span style={{ cursor: "pointer" }}>{providerState?.company}</span>
        </Tooltip>
      </div>
    </nav>
  );
};
