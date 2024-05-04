"use client";

//Components
import { useEffect, useContext } from "react";
import { SidebarContext } from "../layout";
import { useRouter } from "next/navigation";
import { getUser } from "../layout";
import Link from "next/link";

//Utils
import {
  BASKET_ROUTE,
  LOGIN_ROUTE,
  SHOP_ROUTE,
  ORDER_ROUTE,
  CATALOG_ROUTE,
} from "@/utils/Consts";

//Hooks
import { useCart } from "@/hooks/useCart";
import { useTranslate } from "@/hooks/useTranslate";

//Components
import { Breadcrumbs, BreadcrumbItem, Button } from "@nextui-org/react";
import { UserCartItem } from "@/components/userCartItem/UserCartItem";
import { Icons } from "@/components/Icons/Icons";
import { EmptyComponent } from "@/components/EmptyComponent/EmptyComponent";

//Styles
import "swiper/css";
import "./basket.scss";
import "swiper/css/pagination";

export default function Basket() {
  const { setIsActive, userCart, setUserCart, isActive } =
    useContext(SidebarContext);

  const router = useRouter();

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
    isAuthUser();
  }, []);

  async function isAuthUser() {
    try {
      const { status, error } = await getUser();

      if (status === 200) setIsActive(true);

      if (error) router.push(LOGIN_ROUTE);
    } catch (error) {
      console.error(error as Error);
      setIsActive(false);
    }
  }

  const mapAllProductsInBasket = () => {
    if (!userCart.length)
      return (
        <EmptyComponent
          title={emptyBasketTitle}
          text={emptyBasketText}
          route={CATALOG_ROUTE}
          buttonText={emptyBasketButtonText}
        />
      );

    const totalPrice = calculateTotalPrice().toFixed(2);

    return (
      <>
        <h5 className="text-[24px]">{headerCart}</h5>

        <div className="flex flex-col gap-[23px]">
          {userCart.map(item => (
            <UserCartItem
              product={item}
              key={item.id}
              setBasket={setUserCart}
            />
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

            <p className="text-[24px]">{`${cartTotalPriceText} $${totalPrice}`}</p>
          </div>
        </div>
      </>
    );
  };

  if (!isActive) return <Icons id="spiner" />;

  return (
    <main className="container mx-auto mt-[30px] mb-[100px] px-[28px] sm:px-0">
      <Breadcrumbs>
        <BreadcrumbItem href={SHOP_ROUTE}>{mainPageRoute}</BreadcrumbItem>

        <BreadcrumbItem href={BASKET_ROUTE}>{headerCart}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="w-full mt-[48px] gap-[23px] flex flex-col">
        {mapAllProductsInBasket()}
      </div>
    </main>
  );
}
