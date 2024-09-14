//Global
import { showToastMessage } from "@/app/toastsChange";
import { useCallback } from "react";

//Actions
import {
  getUser,
  logInUser,
  registrationUser,
  changeUserDataProfile,
  getOrders,
  getReviews,
  logOutUser,
} from "@/redux/reducers/userSlice";

//Hooks
import { useAppDispatch } from "./useAppDispatch";
import { useCart } from "./useCart";
import { useFavorites } from "./useFavorites";
import { useTranslate } from "./useTranslate";

//Types
import {
  IChangeUserData,
  IInputsLogin,
  IUserInformationApi,
} from "@/types/types";

const useUserActions = () => {
  const dispatch = useAppDispatch();

  const { onResetCart } = useCart(),
    { onResetFavorites } = useFavorites();

  const { messageLogOutSuccess } = useTranslate();

  const onLogInUser = useCallback(
    (information: IInputsLogin) => dispatch(logInUser(information)),
    [dispatch]
  );

  const onRegistrationUser = useCallback(
    (information: IUserInformationApi) =>
      dispatch(registrationUser(information)),
    [dispatch]
  );

  const onChangeUserData = useCallback(
    (newUserData: IChangeUserData) =>
      dispatch(changeUserDataProfile(newUserData)),
    [dispatch]
  );

  const onGetUser = useCallback(() => dispatch(getUser()), [dispatch]),
    onGetOrders = useCallback(() => dispatch(getOrders()), [dispatch]),
    onGetReviews = useCallback(() => dispatch(getReviews()), [dispatch]);

  const onLogOutUser = useCallback(
    () =>
      dispatch(logOutUser())
        .then(() => showToastMessage("success", messageLogOutSuccess))
        .then(() => {
          onResetCart();
          onResetFavorites();
        })
        // eslint-disable-next-line no-console
        .catch(error => console.log(error)),
    [dispatch, messageLogOutSuccess, onResetCart, onResetFavorites]
  );

  return {
    onLogInUser,
    onRegistrationUser,
    onGetUser,
    onChangeUserData,
    onGetOrders,
    onGetReviews,
    onLogOutUser,
  };
};

export { useUserActions };
