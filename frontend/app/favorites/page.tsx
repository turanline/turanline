"use client";

//Global
import { useEffect } from "react";
import { useRouter } from "next/navigation";

//Components
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { EmptyComponent } from "@/components/EmptyComponent/EmptyComponent";
import { ProductCard } from "@/components/ProductCard/productCard";
import { Icons } from "@/components/Icons/Icons";

//Hooks
import { useTranslate } from "@/hooks/useTranslate";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useFavorites } from "@/hooks/useFavorites";

//Utils
import {
  CATALOG_ROUTE,
  FAVORITES_ROUTE,
  LOGIN_ROUTE,
  SHOP_ROUTE,
} from "@/utils/Consts";

//Styles
import "./favorites.scss";

export default function Favorites() {
  const { isAuth, status: userStatus } = useTypedSelector(state => state.user),
    { favorites, status: favoritesStatus } = useTypedSelector(
      state => state.favorites
    );

  const { push } = useRouter();

  const { fetchFavorites } = useFavorites();

  useEffect(() => {
    if (userStatus === "fulfilled") {
      if (isAuth) fetchFavorites();
      else push(LOGIN_ROUTE);
    }
  }, [isAuth, fetchFavorites, userStatus, push]);

  const {
    emptyFavoritesTitle,
    emptyBasketButtonText,
    emptyBasketText,
    mainPageRoute,
    headerFavorites,
  } = useTranslate();

  if (!isAuth || favoritesStatus === "pending" || userStatus === "pending")
    return <Icons id="spiner" />;

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
