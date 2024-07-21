"use client";

//Global
import { useEffect } from "react";

//Hooks
import { useTypedSelector } from "@/hooks/useReduxHooks";
import { useLanguage } from "./useLanguage";

//Cookies
import { getCookie } from "cookies-next";

//Utils
import * as locales from "@/utils/locales";

const useTranslate = () => {
  const { selectedLanguage } = useTypedSelector(state => state.language);

  const { changeSelectedLanguage } = useLanguage();

  useEffect(() => {
    const language = getCookie("selectedLanguage");

    if (language) changeSelectedLanguage(language);
  }, [changeSelectedLanguage]);

  return locales[selectedLanguage.toLowerCase() as keyof typeof locales];
};

export { useTranslate };
