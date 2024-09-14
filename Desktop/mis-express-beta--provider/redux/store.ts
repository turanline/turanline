"use client";
//GLobal
import { configureStore } from "@reduxjs/toolkit";
//Reducers
import userSlice from "./reducers/providerSlice";
import languageSlice from "./reducers/languageSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    language: languageSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
