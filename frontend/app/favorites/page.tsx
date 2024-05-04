"use client";

//Global
import { getUser } from "../layout";
import { useRouter } from "next/navigation";
import { useEffect, useContext } from "react";

//Context
import { SidebarContext } from "../layout";

//Components
import { Icons } from "@/components/Icons/Icons";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { EmptyComponent } from "@/components/EmptyComponent/EmptyComponent";
import { ProductCard } from "@/components/ProductCard/productCard";

//Hooks
import { useTranslate } from "@/hooks/useTranslate";

//Utils
import { CATALOG_ROUTE, FAVORITES_ROUTE, SHOP_ROUTE } from "@/utils/Consts";

//Styles
import "./favorites.scss";

export default function Favorites() {
  const router = useRouter();

  const { isActive, setIsActive, favorites } = useContext(SidebarContext);

  const {
    emptyFavoritesTitle,
    emptyBasketButtonText,
    emptyBasketText,
    mainPageRoute,
    headerFavorites,
  } = useTranslate();

  useEffect(() => {
    isAuthUser();
  }, [router]);

  async function isAuthUser() {
    try {
      const { status, error } = await getUser();

      if (status === 200) setIsActive(true);

      if (error) router.push(SHOP_ROUTE);
    } catch (error) {
      console.error(error as Error);
      setIsActive(false);
    }
  }

  if (!isActive) return <Icons id="spiner" />;

  return (
    <main className="container mx-auto mt-[30px] mb-[30px] px-[28px] sm:px-0">
      <Breadcrumbs>
        <BreadcrumbItem href={SHOP_ROUTE}>{mainPageRoute}</BreadcrumbItem>
        <BreadcrumbItem href={FAVORITES_ROUTE}>
          {headerFavorites}
        </BreadcrumbItem>
      </Breadcrumbs>

      <div className="w-full mt-[25px]">
        {!favorites.length ? (
          <EmptyComponent
            title={emptyFavoritesTitle}
            text={emptyBasketText}
            route={CATALOG_ROUTE}
            buttonText={emptyBasketButtonText}
          />
        ) : (
          <>
            <h5 className="text-[24px] mb-[25px]">{headerFavorites}</h5>

            <div className="favorites_wrapper">
              {favorites.map(item => (
                <ProductCard key={item.id} productInfo={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
