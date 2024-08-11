//Global
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

//Types
import { AppDispatch, RootState } from "@/redux/store";

export const useAppDispatch = () => useDispatch<AppDispatch>(),
  useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
