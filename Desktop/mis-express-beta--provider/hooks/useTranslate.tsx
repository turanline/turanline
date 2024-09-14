"use client";
//Global
import { useEffect,useState } from "react";
//Utils
//Hooks
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useLanguage } from "./useLanguage";
import * as locales from "@/utils/translate/locales";
//Cookies
import { getCookie } from 'cookies-next';

const useTranslate = () => {
  const { selectedLanguage } = useTypedSelector(state => state.language);

  const { changeSelectedLanguage } = useLanguage();

  useEffect(() => {
    const language = getCookie("selectedLanguage");

    if (language) changeSelectedLanguage(language);
  }, [changeSelectedLanguage]);

  const translatedText = locales[selectedLanguage.toLowerCase() as keyof typeof locales];

  return translatedText;
};


export { useTranslate };
