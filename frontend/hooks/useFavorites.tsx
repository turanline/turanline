"use client";

//Global
import { showToastMessage } from "@/app/toastsChange";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

//Components
import { EmptyComponent } from "@/components/EmptyComponent/EmptyComponent";
import { ProductCard } from "@/components/ProductCard/productCard";

//Actions
import {
  addToFavorites as onAddToFavorites,
  deleteFromFavorites as onDeleteFromFavorites,
  fetchFavorites as onFetchFavorites,
  resetFavorites,
} from "@/redux/reducers/favoritesSlice";

//Hooks
import { useAppDispatch, useTypedSelector } from "./useReduxHooks";
import { useTranslate } from "./useTranslate";

//Utils
import { CATALOG_ROUTE, LOGIN_ROUTE } from "@/utils/Consts";

//Component Types
import { IProductMainPage } from "@/types/componentTypes";

const useFavorites = () => {
  const { favorites } = useTypedSelector(state => state.favorites);

  const dispatch = useAppDispatch();

  const { push } = useRouter();

  const {
    emptyFavoritesTitle,
    emptyBasketButtonText,
    emptyBasketText,
    messageFavoritesDeleted,
    messageFavoritesSuccess,
    messageFavoritesWarn,
    headerFavorites,
  } = useTranslate();

  const fetchFavorites = useCallback(
    () => dispatch(onFetchFavorites()),
    [dispatch]
  );

  const addToFavorites = (product: IProductMainPage, isAuth: boolean) => {
    if (isAuth)
      return dispatch(onAddToFavorites(product))
        .then(data => {
          if ("error" in data && data.error.message === "Rejected") {
            showToastMessage(
              "error",
              "Произошла ошибка при добавлении в избранное, попробуйте позже!"
            );
            return;
          }

          showToastMessage("success", messageFavoritesSuccess);
        })
        .catch(error => console.log(error));

    showToastMessage("warn", messageFavoritesWarn);
    push(LOGIN_ROUTE);
    return;
  };

  const onResetFavorites = () => dispatch(resetFavorites());

  const deleteFromFavorites = (product: IProductMainPage) => {
    dispatch(onDeleteFromFavorites(product))
      .then(data => {
        if ("error" in data && data.error.message === "Rejected") {
          showToastMessage(
            "error",
            "Произошла ошибка при удалении из избранное, попробуйте позже!"
          );
          return;
        }

        showToastMessage("success", messageFavoritesDeleted);
      })
      .catch(error => console.log(error));
  };

  const renderUserFavorites = () =>
    !favorites.length ? (
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
    );

  return {
    addToFavorites,
    deleteFromFavorites,
    fetchFavorites,
    onResetFavorites,
    renderUserFavorites,
  };
};

export { useFavorites };
