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
import prefixSlice from "./reducers/prefixSlice";

export const store = configureStore({
  reducer: {
    language: languageSlice,
    products: productsSlice,
    categories: categoriesSlice,
    user: userSlice,
    cart: cartSlice,
    favorites: favoritesSlice,
    prefix: prefixSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
