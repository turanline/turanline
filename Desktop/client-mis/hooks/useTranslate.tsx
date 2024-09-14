"use client";

//Global
import { useEffect } from "react";

//Hooks
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useLanguage } from "./useLanguage";

//Utils
import * as locales from "@/utils/translate/locales";

const useTranslate = () => {
  const { selectedLanguage } = useTypedSelector(state => state.language);

  const { changeSelectedLanguage } = useLanguage();

  useEffect(() => {
    const language = localStorage.getItem("selectedLanguage");

    if (language) changeSelectedLanguage(language);
  }, [changeSelectedLanguage]);

  const translatedText =
    locales[selectedLanguage.toLowerCase() as keyof typeof locales];

  return translatedText;
};

export { useTranslate };
