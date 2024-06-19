"use client";

//Global
import { showToastMessage } from "@/app/toastsChange";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

//Actions
import {
  addToFavorites as onAddToFavorites,
  deleteFromFavorites as onDeleteFromFavorites,
  fetchFavorites as onFetchFavorites,
  resetFavorites,
} from "@/redux/reducers/favoritesSlice";

//Hooks
import { useTranslate } from "./useTranslate";
import { useAppDispatch } from "./useAppDispatch";

//Utils
import { LOGIN_ROUTE } from "@/utils/Consts";

//Types
import { IProductMainPage } from "@/types/types";

const useFavorites = () => {
  const dispatch = useAppDispatch();

  const { push } = useRouter();

  const {
    messageFavoritesDeleted,
    messageFavoritesSuccess,
    messageFavoritesWarn,
  } = useTranslate();

  const fetchFavorites = useCallback(
    () => dispatch(onFetchFavorites()),
    [dispatch]
  );

  const addToFavorites = (product: IProductMainPage, isAuth: boolean) => {
    if (isAuth) {
      dispatch(onAddToFavorites(product))
        .then(() => showToastMessage("success", messageFavoritesSuccess))
        // eslint-disable-next-line no-console
        .catch(error => console.log(error));
    } else {
      showToastMessage("warn", messageFavoritesWarn);

      push(LOGIN_ROUTE);
    }
  };

  const onResetFavorites = () => dispatch(resetFavorites());

  const deleteFromFavorites = (product: IProductMainPage) => {
    dispatch(onDeleteFromFavorites(product))
      .then(() => showToastMessage("success", messageFavoritesDeleted))
      // eslint-disable-next-line no-console
      .catch(error => console.log(error));
  };

  return {
    addToFavorites,
    deleteFromFavorites,
    fetchFavorites,
    onResetFavorites,
  };
};

export { useFavorites };
