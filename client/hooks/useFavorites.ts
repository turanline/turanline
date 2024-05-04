"use client";

//Global
import { showToastMessage } from "@/app/toastsChange";
import { useContext } from "react";

//Services
import { patchUserFavorites } from "@/services/favoritesAPI";
import { postVerifyToken } from "@/services/authAPI";

//Context
import { SidebarContext } from "@/app/layout";

//Types
import { IProductMainPage } from "@/types/types";

const useFavorites = () => {
  const { favorites, setFavorites, isActive } = useContext(SidebarContext);

  const addToFavorites = async (product: IProductMainPage) => {
    if (!isActive)
      showToastMessage(
        "warn",
        "Вы не можете добавить товар в избранное, пока не авторизуйтесь!"
      );

    try {
      const token = localStorage.getItem("AuthTokenMis");

      if (token) {
        const { user } = await postVerifyToken(token);
        const serverArray = favorites.map(item => item.id);

        patchUserFavorites(user, [...serverArray, product.id])
          .then(() => {
            showToastMessage("success", "Товар добавлен в избранное!");
            setFavorites([...favorites, product]);
          })
          .catch(error => console.log(error));
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  };

  const deleteFromFavorites = async (product: IProductMainPage) => {
    try {
      const token = localStorage.getItem("AuthTokenMis");

      if (token) {
        const { user } = await postVerifyToken(token);
        const serverArray = favorites.map(item => item.id);

        const newServerArray = serverArray.filter(item => item !== product.id);

        patchUserFavorites(user, newServerArray).then(() => {
          showToastMessage("success", "Товар удален из избранного!");
          setFavorites(favorites.filter(item => item.id !== product.id));
        });
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  };

  return { addToFavorites, deleteFromFavorites };
};

export { useFavorites };
