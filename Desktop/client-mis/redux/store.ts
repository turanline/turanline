"use client";

//GLobal
import { configureStore } from "@reduxjs/toolkit";

//Reducers
import languageSlice from "./reducers/languageSlice";
import productsSlice from "./reducers/productsSlice";
import categoriesSlice from "./reducers/categoriesSlice";
import userSlice from "./reducers/userSlice";
import cartSlice from "./reducers/cartSlice";
import favoritesSlice from "./reducers/favoritesSlice";

export const store = configureStore({
  reducer: {
    language: languageSlice,
    products: productsSlice,
    categories: categoriesSlice,
    user: userSlice,
    cart: cartSlice,
    favorites: favoritesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
