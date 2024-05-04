//Hooks
import { useAppDispatch } from "./useAppDispatch";

//Actions
import { setSelectedLanguage } from "@/redux/reducers/languageSlice";

const useLanguage = () => {
  const dispatch = useAppDispatch();

  const changeSelectedLanguage = (newLanguage: string) => {
    dispatch(setSelectedLanguage(newLanguage));
  };

  return { changeSelectedLanguage };
};

export { useLanguage };
