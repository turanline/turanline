"use client";
//Global
import React, { useEffect } from "react";
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
import { Button, Tooltip } from "@nextui-org/react";
import { Icons } from "../Icons/Icons";
//Images
import logo from "@/public/assets/other/logo2.svg";
//Hooks
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useTranslate } from "@/hooks/useTranslate";
import { useUserActions } from "@/hooks/useUserActions";
//Styles
import "./Header.scss";
import { LanguageSelect } from "../LanguageSelect/LanguageSelect";

export const Header = () => {
  //hooks
  const { providerState, isProviderAuth } = useTypedSelector(state => state.user);
  const { 
    headerToProfile,
    profilePageLogOut,
    headerMainPage,
    headerProductsPage,
    headerOrdersPage,
    headerPartners
  }= useTranslate();
  const { onLogOutUser, onGetUser } = useUserActions();
  const { push } = useRouter();
  const pathname = usePathname();

  const buttonStyles = {
    backgroundColor: "transparent",
    borderRadius: 0,
    width: "100%",
  };

  const linksArray = [
    {
      route: PROVIDER_ROUTE,
      value: headerMainPage,
    },
    {
      route: PROVIDER_PRODUCTS_ROUTE,
      value: headerProductsPage,
    },
    {
      route: PROVIDER_ORDERS_ROUTE,
      value: headerOrdersPage,
    },
  ];

  useEffect(() => {
    onGetUser();
  }, [onGetUser]);

  const renderLink = () => {
    if (!isProviderAuth) return null;

    return linksArray.map((link, index) => (
      <Link
        key={index}
        href={link.route}
        className={`${link.route === pathname ? "text-tiffani" : "text-black"} headerLinks`}
      >
        {link.value}
      </Link>
    ));
  };

  const renderProvidercompany = () => {
    if(providerState)
    return(
        <div className="flex gap-[10px] items-center">
          <span style={{ cursor: "pointer" }}>{providerState.company}</span>
          <Icons id="providerCompanyArrow" />
        </div>
    );
};




  return (
    <header className="provider-page_header">
      <div className="provider-page_header-content">
        <Link className="flex items-center" href={SHOP_ROUTE}>
          <Image src={logo} alt="logo" />

          <span style={{ fontWeight: 700 }}>{headerPartners}</span>
        </Link>

        <div className="provider-page_header-links">{renderLink()}</div>

        <div className="flex flex-row gap-[10px]">
           <LanguageSelect color="black"/>
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
          {renderProvidercompany()}
           </Tooltip>
        </div>
       
      </div>
    </header>
  );
};
