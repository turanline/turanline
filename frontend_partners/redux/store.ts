"use client";
//GLobal
import { configureStore } from "@reduxjs/toolkit";
//Reducers
import userSlice from "./reducers/providerSlice";
import languageSlice from "./reducers/languageSlice";
import authorizationSlise from "./reducers/authorizationSlise";
import productSlice from "./reducers/productSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    language: languageSlice,
    authorization:authorizationSlise,
    product:productSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
