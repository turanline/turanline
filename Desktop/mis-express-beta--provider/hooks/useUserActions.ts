//Global
import { showToastMessage } from "@/app/toastsChange";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
//Utils
import { LOGIN_ROUTE } from "@/utils/Consts";
//Actions
import {
  getUser,
  logInUser,
  registrationUser,
  logOutUser,
  getNews,
  getReviewsProvider,
  getAllProvidersGood,
  deleteProviderProduct,
  getAllProvidersNotifications,
  getProviderTime,
  setTimer,
  setRegistrationPageNumber,
  getProviderOrders,
  changeProviderProduct,
  getColors,
  setForgetPassword,
} from "@/redux/reducers/providerSlice";
//Hooks
import { useAppDispatch } from "./useAppDispatch";
import { useTranslate } from "./useTranslate";
import { useTypedSelector } from "./useTypedSelector";
//Types
import {
  ILogin,
  IPostRegistrationProvider,
  IResetPassword,
} from "@/types/additionalTypes";

const useUserActions = () => {

  const { selectedLanguage } = useTypedSelector(state => state.language);

  //hooks
  const { messageLogOutSuccess } = useTranslate(),
    dispatch = useAppDispatch(),
    { push } = useRouter();

  //AuthFunctions
  const onLogInUser = useCallback(
    (information: ILogin) => dispatch(logInUser(information)),
    [dispatch]
  );
  const onRegistrationUser = useCallback(
    (information: IPostRegistrationProvider) => dispatch(registrationUser(information)),
    [dispatch]
  );


  const onGetUser = useCallback(
    () => dispatch(getUser()), 
  [dispatch]
  );
  const onLogOutUser = useCallback(
    () =>
      dispatch(logOutUser())
        .then(() => {
          showToastMessage("success", messageLogOutSuccess);
          onSetRegistrationPage(1);
          push(LOGIN_ROUTE);
        })
        .catch(error => console.log(error)),
    [dispatch, messageLogOutSuccess]
  );

  //Providers Data Functions
  const onGetProviderNews = useCallback(() => dispatch(getNews()), [dispatch,selectedLanguage]);

  const onSetTimer = useCallback(
    (timer: number) => dispatch(setTimer(timer)),
    [dispatch]
  );

  const onSetRegistrationPage = useCallback(
    (page: number) => dispatch(setRegistrationPageNumber(page)),
    [dispatch]
  );

  const onSetForgetPassword = useCallback(
    (set: boolean) => dispatch(setForgetPassword(set)),
    [dispatch]
  );

  const onGetProviderReviews = useCallback(
    () => dispatch(getReviewsProvider()),
    [dispatch,selectedLanguage]
  );

  const onDeleteProviderProduct = useCallback(
    (slug: string) => dispatch(deleteProviderProduct(slug)),
    [dispatch]
  );

  const onChangeProviderProduct = useCallback(
    (slug: string) => dispatch(changeProviderProduct(slug)),
    [dispatch]
  );

  const onGetProviderGoods = useCallback(
    () => dispatch(getAllProvidersGood()),
    [dispatch,selectedLanguage]
  );

  const onGetProviderNotifications = useCallback(
    () => dispatch(getAllProvidersNotifications()),
    [dispatch,selectedLanguage]
  );

  const onGetProviderTime = useCallback(
    () => dispatch(getProviderTime()),
    [dispatch]
  );

  const onGetProviderOrders = useCallback(
    () => dispatch(getProviderOrders()),
    [dispatch,selectedLanguage]
  );
  const onGetColors = useCallback(
    () => dispatch(getColors()),
    [dispatch]);


  return {
    onLogInUser,
    onRegistrationUser,
    onGetUser,
    onLogOutUser,
    onGetProviderNews,
    onGetProviderReviews,
    onGetProviderGoods,
    onDeleteProviderProduct,
    onGetProviderNotifications,
    onGetProviderTime,
    onSetTimer,
    onGetProviderOrders,
    onChangeProviderProduct,
    onGetColors,
    onSetRegistrationPage,
    onSetForgetPassword,
  };
};

export { useUserActions };
