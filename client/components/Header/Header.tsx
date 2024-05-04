"use client";

//Global
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { showToastMessage } from "@/app/toastsChange";

//Components
import { Icons } from "../Icons/Icons";
import { Badge } from "@nextui-org/react";
import { SearchModal } from "../SearchModal/SearchModal";
import { HeaderSearch } from "../HeaderSearch/HeaderSearch";
import { LanguageSelect } from "../LanguageSelect/LanguageSelect";

//Hooks
import { useTranslate } from "@/hooks/useTranslate";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

//Utils
import {
  ABOUT_ROUTE,
  BASKET_ROUTE,
  CATALOG_ROUTE,
  CONTACTS_ROUTE,
  DELIVERY_ROUTE,
  FAVORITES_ROUTE,
  LOGIN_ROUTE,
  PROFILE_ROUTE,
  SHOP_PHONE_4,
  SHOP_ROUTE,
} from "@/utils/Consts";

//Icons
import logo from "@/public/assets/other/logo.svg";

//Types
import { IHeaderProps } from "@/types/types";

//Styles
import "./Header.scss";

export default function Header({
  isActive,
  userCart,
  favorites,
}: IHeaderProps) {
  const [searchModal, setSearchModal] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);

  const { category } = useTypedSelector(state => state.products),
    { categories } = useTypedSelector(state => state.categories);

  const { onSetCategory, onSetFiltered } = useProducts(),
    { onSetCategories, mapCategoriesOnDesktop, mapCategoriesOnPhone } =
      useCategories();

  useEffect(() => {
    onSetCategories();
  }, []);

  const {
    headerAbout,
    headerCart,
    headerCatalog,
    headerContacts,
    headerDelivery,
    headerLogIn,
    headerProfile,
    headerFavorites,
  } = useTranslate();

  const handleClickButton = (message: string) => {
    if (!isActive) {
      showToastMessage("warn", message);
    }
  };

  const burderMenuClass = isOpen ? "header-burder active" : "header-burder";
  const cartCounter = userCart.length ? "w-[25px] h-[25px] visible" : "hidden";
  const favoritesCounter = favorites.length
    ? "w-[25px] h-[25px] visible"
    : "hidden";

  const accountProfileText = !isActive ? headerLogIn : headerProfile;
  const PROFILE_ROUTER = !isActive ? LOGIN_ROUTE : PROFILE_ROUTE;
  const FAVORITE_ROUTER = !isActive ? LOGIN_ROUTE : FAVORITES_ROUTE;

  return (
    <header>
      <div className="container mx-auto px-[29px] sm:px-0">
        <div className="hidden lg:flex justify-between py-[25px]">
          <div className="flex items-center gap-2">
            <LanguageSelect />

            <Link href={`tel:${SHOP_PHONE_4}`}>{SHOP_PHONE_4}</Link>
          </div>

          <div className="flex gap-[75px]">
            <Link href={CATALOG_ROUTE}>{headerCatalog}</Link>

            <Link href={ABOUT_ROUTE}>{headerAbout}</Link>

            <Link href={DELIVERY_ROUTE}>{headerDelivery}</Link>

            <Link href={CONTACTS_ROUTE}>{headerContacts}</Link>
          </div>
        </div>

        <div className="flex justify-between mb-[25px] gap-[46px] pt-[25px] lg:pt-0">
          <Link href={SHOP_ROUTE}>
            <Image src={logo} alt="logo" width={110} />
          </Link>

          <HeaderSearch
            isHidden={true}
            category={category}
            onSetCategory={onSetCategory}
            allCategories={categories}
          />

          <div className="hidden lg:flex gap-[30px]">
            <Link
              href={FAVORITE_ROUTER}
              className="flex flex-col items-center"
              onClick={() =>
                handleClickButton(
                  "Избранное доступно только для авторизованных пользователей"
                )
              }
            >
              <Badge
                content={favorites.length}
                color="danger"
                className={favoritesCounter}
              >
                <Icons id="heart" />
              </Badge>

              <p>{headerFavorites}</p>
            </Link>

            <Link
              href={BASKET_ROUTE}
              className="flex flex-col items-center"
              onClick={() =>
                handleClickButton(
                  "Корзина доступна только для авторизованных пользователей"
                )
              }
            >
              <Badge
                content={userCart.length}
                color="danger"
                className={cartCounter}
              >
                <Icons id="shopping1" />
              </Badge>

              <p>{headerCart}</p>
            </Link>

            <Link
              href={PROFILE_ROUTER}
              className="flex flex-col items-center justify-between"
            >
              <Icons id={!isActive ? "profile-account" : "profile"} />

              <p>{accountProfileText}</p>
            </Link>
          </div>
          <div className="flex  lg:hidden items-center  gap-[20px]">
            <button onClick={() => setSearchModal(!searchModal)}>
              <Icons id="searchMobile" />
            </button>

            <Link
              href={BASKET_ROUTE}
              onClick={() =>
                handleClickButton(
                  "Корзина доступна только для авторизованных пользователей"
                )
              }
            >
              <Badge
                content={userCart.length}
                color="danger"
                className={cartCounter}
              >
                <Icons id="shopping" />
              </Badge>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-[45px] md:w-[44px] cursor-pointer"
            >
              <Icons id="burger" />
            </button>
          </div>
        </div>

        <div className={burderMenuClass}>
          <div className="grid grid-cols-2 grid-rows-5 gap-[20px] sm:gap-0">
            <div className="flex flex-col gap-[20px] row-span-4">
              <Link href={CATALOG_ROUTE}>{headerCatalog}</Link>

              <Link href={ABOUT_ROUTE}>{headerAbout}</Link>

              <Link href={DELIVERY_ROUTE}>{headerDelivery}</Link>

              <Link href={CONTACTS_ROUTE}>{headerContacts}</Link>
              <Link href={`tel:${SHOP_PHONE_4}`}>{SHOP_PHONE_4}</Link>
            </div>

            {mapCategoriesOnPhone()}

            <div className="sm:hidden flex items-center row-span-1 col-span-2 gap-[20px]">
              <Link href={PROFILE_ROUTER} className="block">
                <div className="flex items-center gap-[12px]">
                  <Icons id={!isActive ? "person" : "profile"} />

                  <p>{accountProfileText}</p>
                </div>
              </Link>

              <Link
                href={FAVORITE_ROUTER}
                className="block"
                onClick={() =>
                  handleClickButton(
                    "Избранное доступно только для авторизованных пользователей"
                  )
                }
              >
                <div className="flex items-center gap-[12px]">
                  <Badge
                    content={favorites.length}
                    color="danger"
                    className={favoritesCounter}
                  >
                    <Icons id="heart" />
                  </Badge>

                  <p>{headerFavorites}</p>
                </div>
              </Link>

              <LanguageSelect />
            </div>
          </div>
          <div className="hidden sm:grid grid-cols-2 grid-rows-5 border-l-1 border-border gap-[24px] pl-[38px]">
            <div className="flex flex-col gap-[24px] col-span-1 row-span-4">
              <Link href="/category">Категория 1</Link>

              <Link href="/category">Категория 1</Link>

              <Link href="/category">Категория 1</Link>

              <Link href="/category">Категория 1</Link>
            </div>

            <div className="flex flex-col gap-[24px] col-span-1  row-span-4">
              <Link href="/category">Категория 1</Link>

              <Link href="/category">Категория 1</Link>

              <Link href="/category">Категория 1</Link>

              <Link href="/category">Категория 1</Link>
            </div>

            <div className="flex items-center row-span-2 col-span-2 gap-[20px]">
              <Link href={PROFILE_ROUTER} className="block">
                <div className="flex items-center gap-[12px]">
                  <Icons id={!isActive ? "person" : "profile"} />

                  <p>{accountProfileText}</p>
                </div>
              </Link>

              <Link
                href={FAVORITE_ROUTER}
                className="block"
                onClick={() =>
                  handleClickButton(
                    "Избранное доступно только для авторизованных пользователей"
                  )
                }
              >
                <div className="flex items-center gap-[12px]">
                  <Badge
                    content={favorites.length}
                    color="danger"
                    className={favoritesCounter}
                  >
                    <Icons id="heart" />
                  </Badge>

                  <p>{headerFavorites}</p>
                </div>
              </Link>

              <LanguageSelect />
            </div>
          </div>
        </div>
      </div>

      {mapCategoriesOnDesktop()}

      <SearchModal
        isHidden={false}
        setSearchModal={setSearchModal}
        searchModal={searchModal}
        allCategories={categories}
        onSetCategory={onSetCategory}
        category={category}
      />
    </header>
  );
}
