"use client";

//Global
import { useCallback } from "react";

//Hooks
import { useAppDispatch } from "./useReduxHooks";

//Actions
import { setSelectedLanguage } from "@/redux/reducers/languageSlice";

const useLanguage = () => {
  const dispatch = useAppDispatch();

  const changeSelectedLanguage = useCallback(
    (newLanguage: string) => dispatch(setSelectedLanguage(newLanguage)),
    [dispatch]
  );

  return { changeSelectedLanguage };
};

export { useLanguage };
