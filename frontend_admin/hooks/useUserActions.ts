'use client';
//Global
import { showToastMessage } from "@/app/toastsChange";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
//Utils
import { LOGIN_ROUTE,REGISTRATION_ROUTE,PROVIDER_ROUTE } from "@/utils/Consts";
//Services
import { getVerifySmsCode } from "@/services/codeConfirmation";
//Actions
import {
  getNews,
  getReviewsProvider,
  getAllProvidersNotifications,
  getProviderTime,
  setTimer,
  getCountries,
  getProviderAccountBalance,
} from "@/redux/reducers/providerSlice";
import {
  getUser,
  logInUser,
  registrationUser,
  logOutUser,
  setForgetPassword,
  setRegistrationPageNumber
 } from "@/redux/reducers/authorizationSlise";
 import {
  getAllProvidersGood,
  getProviderOrders,
  getColors,
 } from "@/redux/reducers/productSlice";
//Hooks
import { useAppDispatch } from "./useAppDispatch";
import { useTranslate } from "./useTranslate";
import { useTypedSelector } from "./useTypedSelector";
//Cookies
import { setCookie } from "cookies-next";
//Types
import {
  ILogin,
  IPostRegistrationProvider,
  loginProps,
  registrationProps
} from "@/types/additionalTypes";

const useUserActions = () => {


  //hooks
  const { selectedLanguage } = useTypedSelector(state => state.language);
  const translate = useTranslate();
  const dispatch = useAppDispatch();
  const { push } = useRouter();

  const onGetUser = useCallback(() => dispatch(getUser()), [dispatch]);
  const onGetCountries = useCallback(() => dispatch(getCountries(selectedLanguage)), [dispatch]);

  
  const onGetProviderNews = useCallback(async () => {
    try {
      const response = await dispatch(getNews());

    } catch (error) {
      showToastMessage("warn", translate.notifyCouldntGetNews);
    }

  }, [dispatch,selectedLanguage]);

  //AuthFunctions
  const onLogInUser = useCallback(async (information: ILogin,{rememberMe, selectPhone, prefixCode}:loginProps) => {
    try {
      const response = await dispatch(logInUser(information));

      if(response.payload?.access){
        if(rememberMe){
          setCookie('userPhoneRemember',selectPhone.replace(/[^\d+]/g, ''));
          setCookie('phonePrefix', prefixCode);
        };
        
        showToastMessage("success", translate.messageLogInSuccess);
        return;
      };

      if (response.payload === 'Error: 403') {
        push(LOGIN_ROUTE);
        showToastMessage("warn", translate.notifyCouldntFindUser);
        return;
      }

      if (response.payload === 'Error: 406') {
        setCookie('phoneNumber',(prefixCode + selectPhone).replace(/[^\d+]/g, ''));

        
        onSetRegistrationPage(3);
        push(REGISTRATION_ROUTE);
        await getVerifySmsCode((prefixCode + selectPhone).replace(/[^\d+]/g, ''),'verification');
        showToastMessage("warn", translate.notifyUserNorVerified);
        return;
      }

      if (response.payload === 'Error: 401') {
        showToastMessage("error", translate.messageLogInError);
        return;
      };

      if (response.payload === 'Error: 404') {
        showToastMessage("error", translate.notifyCouldntFindUser);
        return;
      };
      switch (response.payload.state) {
        case "M":
          showToastMessage("warn", translate.notifyAccountModeration);
          push(REGISTRATION_ROUTE);
          break;
        case "B":
          showToastMessage("warn", translate.notifyAccountBlocked);
          push(REGISTRATION_ROUTE);
          break;
        case "C":
          showToastMessage("warn", translate.notifyAccountDecliened);
          push(REGISTRATION_ROUTE);
          break;
        case "F":
          showToastMessage("success", translate.messageLogInSuccess);
          push(PROVIDER_ROUTE);
          break;
        default:
          break;
      };
    } catch (error) {
      console.error(error);
    }
  },[dispatch]);


  const onRegistrationUser = useCallback(async (information: IPostRegistrationProvider,{phone_number,selectPhoneRegistration,nextStep}: registrationProps) => {
 
    try {
      const response = await dispatch(registrationUser(information));

      if(response.payload.status === 200){
        showToastMessage('success',translate.notifySuccessfulRegistration);
        onGetUser();
        onSetRegistrationPage(4);
        return;
      };

      if(response.payload.status === 201){
        showToastMessage('success',translate.notifySuccessfulRegistration);
        showToastMessage('warn',translate.notifyVerifyPhone);
        await getVerifySmsCode(response.payload.data.user.phone_number,'verification')
        setCookie('phoneNumber',(selectPhoneRegistration + phone_number).replace(/[^\d+]/g, ''))
    
        nextStep();
        return;
      };
    
      if ("error" in response && response?.error?.message === "Rejected"){
        showToastMessage('error',translate.notifyUnSuccessfulRegistration);
        return;
      };
    } catch (error) {
      console.log(error)
    }

  },[dispatch]);

  const onLogOutUser = useCallback(async () => {
    try {
      const response = await dispatch(logOutUser());

      if (response.meta.requestStatus === "fulfilled") {
        showToastMessage("success", translate.messageLogOutSuccess);
        onSetRegistrationPage(1);
        push(LOGIN_ROUTE);
      };

    } catch (error) {
      showToastMessage("error", translate.notifyCouldntLogout);
    }
  },[dispatch, translate]);

  //Providers Data Functions
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

  const onGetProviderReviews = useCallback(async () => {
    try {
      const response = await dispatch(getReviewsProvider());

    } catch (error) {
      showToastMessage("warn", translate.notifyCouldntGetReviews);
    }
  },[dispatch,selectedLanguage]);

  const onGetProviderBalance = useCallback(async () => {
    try {
      const response = await dispatch(getProviderAccountBalance());

    } catch (error) {
      showToastMessage("warn", translate.notifyCouldntGetBalance);
    }
  },[dispatch]);


  const onGetProviderGoods = useCallback(async () => {
    try {
      const response = await dispatch(getAllProvidersGood());
    } catch (error) {
      console.error(error);
    }
  },[dispatch,selectedLanguage]);

  const onGetProviderNotifications = useCallback(async() => {
    try {
      const response = await dispatch(getAllProvidersNotifications());
    } catch (error) {
      showToastMessage('warn',translate.notifyCouldntGetNotifications);
    };

  },[dispatch,selectedLanguage]);

  const onGetProviderTime = useCallback(async () =>{
    try {
      const response = await dispatch(getProviderTime());
    } catch (error) {
      showToastMessage('warn',translate.notifyCouldntGetTimer);
    }

  },[dispatch]);

  const onGetProviderOrders = useCallback(async () => {
    try {
      const reponse = await dispatch(getProviderOrders());
    } catch (error) {
      console.error(error);
    }
  },[dispatch,selectedLanguage]);


  const onGetColors = useCallback(async () => {
    try {
      const response = await dispatch(getColors());
    } catch (error) {
      console.error(error)
    }
  },[dispatch]);


  return {
    onLogInUser,
    onRegistrationUser,
    onGetUser,
    onLogOutUser,
    onGetProviderNews,
    onGetProviderReviews,
    onGetProviderGoods,
    onGetProviderNotifications,
    onGetProviderTime,
    onSetTimer,
    onGetProviderOrders,
    onGetColors,
    onSetRegistrationPage,
    onSetForgetPassword,
    onGetCountries,
    onGetProviderBalance
  };
};

export { useUserActions };
