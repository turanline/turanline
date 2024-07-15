"use client";

//Global
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { showToastMessage } from "@/app/toastsChange";
import { useRouter } from "next/navigation";

//Components
import {
  Badge,
  Tooltip,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { SearchModal } from "../SearchModal/SearchModal";
import { HeaderSearch } from "../HeaderSearch/HeaderSearch";
import { LanguageSelect } from "../LanguageSelect/LanguageSelect";
import { Icons } from "../Icons/Icons";

//Hooks
import { useTranslate } from "@/hooks/useTranslate";
import { useTypedSelector } from "@/hooks/useReduxHooks";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useCart } from "@/hooks/useCart";
import { useUserActions } from "@/hooks/useUserActions";
import { useFavorites } from "@/hooks/useFavorites";

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
  SHOP_PHONE,
  SHOP_ROUTE,
} from "@/utils/Consts";

//Icons
import logo from "@/public/assets/other/logo.svg";
import logo2 from "@/public/assets/other/logo2.svg";

//Styles
import "./Header.scss";

export function Header() {
  const [searchModal, setSearchModal] = useState<boolean>(false),
    [isOpen, setIsOpen] = useState<boolean>(false);

  const { category } = useTypedSelector(state => state.products),
    { categories } = useTypedSelector(state => state.categories),
    { isAuth, status } = useTypedSelector(state => state.user),
    { cart } = useTypedSelector(state => state.cart),
    { favorites } = useTypedSelector(state => state.favorites);

  const { onSetCategory } = useProducts(),
    { onGetUser, onLogOutUser } = useUserActions(),
    { fetchCart } = useCart(),
    { fetchFavorites } = useFavorites(),
    {
      onSetCategories,
      mapCategoriesOnDesktop,
      mapCategoriesOnPhone,
      onSetTypes,
      onSetSubtypes,
    } = useCategories("#E30387");

  const { push } = useRouter();

  useEffect(() => {
    onGetUser();
  }, [onGetUser]);

  useEffect(() => {
    if (status === "fulfilled" && isAuth) {
      fetchFavorites();
      fetchCart();
    }
  }, [isAuth, status, fetchFavorites, fetchCart]);

  useEffect(() => {
    onSetCategories();
    onSetTypes();
    onSetSubtypes();
  }, [onSetCategories, onSetTypes, onSetSubtypes]);

  const {
    headerAbout,
    headerCart,
    headerCatalog,
    headerContacts,
    headerDelivery,
    headerLogIn,
    headerProfile,
    headerFavorites,
    messageHeaderCart,
    messageHeaderFavorites,
    orderPageSearch,
    profilePageLogOut,
    headerToProfile,
  } = useTranslate();

  const buttonStyles = {
    backgroundColor: "transparent",
    borderRadius: 0,
    width: "100%",
  };

  const handleClickButton = (message: string) => {
    if (!isAuth) showToastMessage("warn", message);
  };

  const renderHeaderLink = (isMobile: boolean) => (
    <Link
      href={PROFILE_ROUTER}
      className={`flex ${
        !isMobile ? "flex-col" : "flex-row gap-[10px]"
      } items-center justify-between`}
    >
      <Icons id={!isMobile ? "profileAccountWhite" : "profile-account"} />
      <p className={!isMobile ? "text-white" : "text-black"}>
        {accountProfileText}
      </p>
    </Link>
  );

  const renderHeaderTooltip = () => (
    <Tooltip
      classNames={{ content: "p-0 overflow-hidden" }}
      style={{ cursor: "pointer" }}
      content={
        <div className="flex flex-col items-center">
          <Button
            className="h-[40px] flex items-center"
            onClick={() => push(PROFILE_ROUTE)}
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
      <div className="flex flex-col items-center cursor-pointer">
        <Icons id="profileWhiteAccount" />
        <span className="text-white">{accountProfileText}</span>
      </div>
    </Tooltip>
  );

  const renderHeaderDropdown = () => (
    <Dropdown isKeyboardDismissDisabled>
      <DropdownTrigger>
        <div className="flex gap-[10px]">
          <Icons id="profile" />
          <p className="text-black">{accountProfileText}</p>
        </div>
      </DropdownTrigger>
      <DropdownMenu classNames={{ base: "p-0" }}>
        <DropdownItem style={{ textAlign: "center", height: "40px" }}>
          <Link href={PROFILE_ROUTE}>{headerToProfile}</Link>
        </DropdownItem>
        <DropdownItem
          style={{ textAlign: "center", height: "40px" }}
          onClick={onLogOutUser}
        >
          {profilePageLogOut}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );

  const returnHeaderElement = (isMobile: boolean) => {
    if (!isAuth) return renderHeaderLink(isMobile);

    if (!isMobile) return renderHeaderTooltip();

    return renderHeaderDropdown();
  };

  const burderMenuClass = isOpen ? "header-burder active" : "header-burder",
    cartCounter = cart?.length ? "w-[25px] h-[25px] visible" : "hidden",
    favoritesCounter = favorites?.length
      ? "w-[25px] h-[25px] visible"
      : "hidden";

  const accountProfileText = !isAuth ? headerLogIn : headerProfile,
    PROFILE_ROUTER = !isAuth ? LOGIN_ROUTE : PROFILE_ROUTE,
    FAVORITE_ROUTER = !isAuth ? LOGIN_ROUTE : FAVORITES_ROUTE,
    CART_ROUTE = !isAuth ? LOGIN_ROUTE : BASKET_ROUTE;

  return (
    <header className="header-color">
      <div className="container mx-auto px-[29px] sm:px-0">
        <nav className="hidden lg:flex justify-between py-[25px]">
          <div className="flex items-center gap-2">
            <LanguageSelect color="white" />

            <Link className="text-white" href={`tel:${SHOP_PHONE}`}>
              {SHOP_PHONE}
            </Link>
          </div>

          <div className="flex gap-[75px]">
            <Link className="text-white" href={CATALOG_ROUTE}>
              {headerCatalog}
            </Link>

            <Link className="text-white" href={ABOUT_ROUTE}>
              {headerAbout}
            </Link>

            <Link className="text-white" href={DELIVERY_ROUTE}>
              {headerDelivery}
            </Link>

            <Link className="text-white" href={CONTACTS_ROUTE}>
              {headerContacts}
            </Link>
          </div>
        </nav>

        <nav className="flex justify-between mb-[25px] gap-[46px] pt-[25px] lg:pt-0">
          <Link href={SHOP_ROUTE} className="flex items-center justify-center">
            <Image data-logo="desktop" src={logo} alt="logo" />

            <Image data-logo="mobile" src={logo2} alt="logo2" />
          </Link>

          <HeaderSearch
            isHidden={true}
            category={category}
            onSetCategory={onSetCategory}
            allCategories={categories}
          />

          <div className="hidden lg:flex gap-[25px]">
            <Link
              href={FAVORITE_ROUTER}
              className="flex flex-col items-center"
              onClick={() => handleClickButton(messageHeaderFavorites)}
            >
              <Badge
                content={favorites?.length}
                color="danger"
                className={favoritesCounter}
              >
                <Icons id="whiteHeart" />
              </Badge>

              <span className="text-white">{headerFavorites}</span>
            </Link>

            <Link
              href={CART_ROUTE}
              className="flex flex-col items-center"
              onClick={() => handleClickButton(messageHeaderCart)}
            >
              <Badge
                content={cart?.length}
                color="danger"
                className={cartCounter}
              >
                <Icons id="whiteCart" />
              </Badge>

              <span className="text-white">{headerCart}</span>
            </Link>

            {returnHeaderElement(false)}
          </div>
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-[45px] md:w-[44px] cursor-pointer"
            >
              <Icons id="burger" />
            </button>
          </div>
        </nav>

        <div className={burderMenuClass}>
          <nav className="flex items-start justify-between flex-wrap gap-[20px]">
            <div className="flex flex-col gap-[20px]">
              <Link href={CATALOG_ROUTE}>{headerCatalog}</Link>

              <Link href={ABOUT_ROUTE}>{headerAbout}</Link>

              <Link href={DELIVERY_ROUTE}>{headerDelivery}</Link>

              <Link href={CONTACTS_ROUTE}>{headerContacts}</Link>

              <Link href={`tel:${SHOP_PHONE}`}>{SHOP_PHONE}</Link>
            </div>

            {mapCategoriesOnPhone()}

            <div className="sm:hidden flex flex-wrap items-center gap-[20px]">
              {returnHeaderElement(true)}

              <Link
                href={FAVORITE_ROUTER}
                className="block flex items-center gap-[10px]"
                onClick={() => handleClickButton(messageHeaderFavorites)}
              >
                <Badge
                  content={favorites?.length}
                  color="danger"
                  className={favoritesCounter}
                >
                  <Icons id="heart" />
                </Badge>

                <p>{headerFavorites}</p>
              </Link>
              <button
                className="flex items-center gap-[10px]"
                onClick={() => setSearchModal(!searchModal)}
              >
                <Icons id="searchMobile" />

                <p>{orderPageSearch}</p>
              </button>
              <Link
                className="flex items-center gap-[10px]"
                href={BASKET_ROUTE}
                onClick={() => handleClickButton(messageHeaderCart)}
              >
                <Badge
                  content={cart?.length}
                  color="danger"
                  className={cartCounter}
                >
                  <Icons id="shopping" />
                </Badge>

                <p>{headerCart}</p>
              </Link>
              <LanguageSelect color="black" />
            </div>
          </nav>

          <div className="hidden sm:grid flex items-start gap-[24px] pl-[38px]">
            <div className="flex flex-wrap items-center gap-[20px]">
              {returnHeaderElement(true)}

              <Link
                href={FAVORITE_ROUTER}
                className="block"
                onClick={() => handleClickButton(messageHeaderFavorites)}
              >
                <div className="flex items-center gap-[10px]">
                  <Badge
                    content={favorites?.length}
                    color="danger"
                    className={favoritesCounter}
                  >
                    <Icons id="heart" />
                  </Badge>

                  <p>{headerFavorites}</p>
                </div>
              </Link>

              <button
                className="flex items-center gap-[10px]"
                onClick={() => setSearchModal(!searchModal)}
              >
                <Icons id="searchMobile" />

                <p>{orderPageSearch}</p>
              </button>

              <Link
                className="flex items-center gap-[10px]"
                href={BASKET_ROUTE}
                onClick={() => handleClickButton(messageHeaderCart)}
              >
                <Badge
                  content={cart.length}
                  color="danger"
                  className={cartCounter}
                >
                  <Icons id="shopping" />
                </Badge>

                <p>{headerCart}</p>
              </Link>

              <LanguageSelect color="black" />
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
