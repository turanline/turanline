"use client";

//Hooks
import { useAppDispatch } from "./useAppDispatch";

//Actions
import { registrationProvider } from "@/redux/reducers/providerSlice";

//Types
import { IPostRegistrationProvider } from "@/types/types";

export const useProviderActions = () => {
  const dispatch = useAppDispatch();

  const onRegistrationProvider = (providerData: IPostRegistrationProvider) =>
    dispatch(registrationProvider(providerData));

  return { onRegistrationProvider };
};
