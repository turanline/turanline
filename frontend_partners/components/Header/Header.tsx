"use client";
//Global
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
//Utils
import {
  PROVIDER_ROUTE,
  PROVIDER_PRODUCTS_ROUTE,
  PROVIDER_ORDERS_ROUTE,
  SHOP_ROUTE,
} from "@/utils/Consts";
//Components
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { LanguageSelect } from "../LanguageSelect/LanguageSelect";
import { Icons } from "../Icons/Icons";
//Images
import logo from "@/public/assets/other/logo.png";
//Hooks
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useTranslate } from "@/hooks/useTranslate";
import { useUserActions } from "@/hooks/useUserActions";
//Styles
import "./Header.scss";

export const Header = () => {
  //hooks
  const { providerState, isProviderAuth,status } = useTypedSelector((state) => state.authorization);
  const translate = useTranslate();
  const { onLogOutUser, onGetUser } = useUserActions();
  const { push } = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  const mobileOpenClassName = useMemo(() =>`${isMobileOpen? " provider-page_header-mobile-wrapper provider-page_header-mobile-wrapper--open": "provider-page_header-mobile-wrapper"}`,[isMobileOpen]);

  const linksArray = [
    {
      route: PROVIDER_ROUTE,
      value: translate.headerMainPage,
    },
    {
      route: PROVIDER_PRODUCTS_ROUTE,
      value: translate.headerProductsPage,
    },
    {
      route: PROVIDER_ORDERS_ROUTE,
      value: translate.headerOrdersPage,
    },
  ];

  const handleMobile = (state: boolean, condition: boolean = true) => {
    if (condition) {
      setIsMobileOpen(state);
    }
  };

  const openMobile = () => handleMobile(true);

  const closeMobile = () => handleMobile(false, true);

  const closeMobileByOutside = (e: React.MouseEvent) => handleMobile(false, e.target === e.currentTarget);

  const renderLink = () => {
    if (!isProviderAuth) return null;

    return linksArray.map((link, index) => (
      <Link
        key={index}
        href={link.route}
        className={`${
          link.route === pathname ? "text-tiffani" : "text-black"
        } headerLinks`}
      >
        {link.value}
      </Link>
    ));
  };

  const renderProvidercompany = () => {
    if (providerState)
      return (
        <>
          <span>{providerState.company}</span>
          <Icons id="providerCompanyArrow" />
        </>
      );
  };

  const renderMobileBurger = () => {
    if(!isProviderAuth && status === 'fulfilled')
    return(
      <button className="provider-page_header-mobile-language">
         <LanguageSelect color="black" />
      </button>
    );
    return(
      <button
      className="provider-page_header-mobile-open-btn"
      onClick={openMobile}
    >
      <Icons id="burger" />
      </button>
    );
  }

  useEffect(() => {
    onGetUser();
  }, [onGetUser]);

  useEffect(() => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  }, [pathname]);

  return (
    <header className="provider-page_header">
      <div className="provider-page_header-content container">
        <Link className="flex items-center" href={SHOP_ROUTE}>
          <Image width={90} height={30} src={logo} alt="logo" />

          <span>{translate.headerPartners}</span>
        </Link>

        <div className="provider-page_header-links">{renderLink()}</div>
       {renderMobileBurger()}
        <div className={mobileOpenClassName} onClick={closeMobileByOutside}>
          <div className="provider-page_header-mobile">
            <button
            
              onClick={closeMobile}
              className="provider-page_header-close-btn"
            >
              <Icons id="deleteCard" />
            </button>
            <div className="flex flex-row gap-[10px]">
              <LanguageSelect color="black" />
              <Dropdown>
                <DropdownTrigger>
                  <div className="flex flex-row gap-[10px] items-center cursor-pointer">
                    {renderProvidercompany()}
                  </div>
                </DropdownTrigger>
                <DropdownMenu className="flex flex-col items-center">
                  <DropdownItem onTouchStart={() => push(PROVIDER_ROUTE)} onClick={() => push(PROVIDER_ROUTE)} textValue="Go to profile">
                    <p className="h-[40px] flex items-center  justify-center  w-full">
                    {translate.headerToProfile}
                    </p>
                  </DropdownItem>
                  <DropdownItem textValue="Logout">
                    <Button onTouchStart={onLogOutUser} onClick={onLogOutUser} className="bg-transparent w-full">
                      {translate.profilePageLogOut}
                    </Button>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className="provider-page_header-mobile-links">
              {renderLink()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};