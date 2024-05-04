//Hooks
import { useTypedSelector } from "@/hooks/useTypedSelector";

//Utils
import * as locales from "@/utils/translate/locales";

const useTranslate = () => {
  const { selectedLanguage } = useTypedSelector(state => state.language);

  const translatedText =
    locales[selectedLanguage.toLowerCase() as keyof typeof locales];

  return translatedText;
};

export { useTranslate };
