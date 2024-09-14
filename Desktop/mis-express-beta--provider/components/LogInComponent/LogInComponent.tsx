"use client";
//Global
import { useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import React, { FC, useEffect, useState } from "react";
import { showToastMessage } from "@/app/toastsChange";
//Components
import { Icons } from "@/components/Icons/Icons";
import { Checkbox, Button, Input} from "@nextui-org/react";
import ForgetPasswordModal from "../Modals/ForgetPasswordModal/ForgetPasswordModal";
//Cookies
import { getCookie, setCookie } from 'cookies-next';
//Utils
import {
  OFFER_PAGE_ROUTE,
  PROVIDER_BLOCKED_ROUTE,
  PROVIDER_ROUTE,
  REGISTRATION_ROUTE,
  THIRD_STAGE_ROUTE,
} from "@/utils/Consts";
//Hooks
import { useCustomForm } from "@/hooks/useCustomForm.";
import { useTranslate } from "@/hooks/useTranslate";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useUserActions } from "@/hooks/useUserActions";
//Types
import { IInputsLogin, ILogin } from "@/types/additionalTypes";
//Styles
import "./LoginComponent.scss";
import { getVerifySmsCode } from "@/services/authAPI";

export const LogInComponent: FC = () => {
  const [forgetModal, setForgetModal] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [selectPhone,setSelectPhone] = useState<string>('');
  //hooks
  const { push } = useRouter();
  const translate = useTranslate();
  const { onLogInUser, onGetUser ,onSetRegistrationPage,onSetForgetPassword} = useUserActions();
  const { status, isProviderAuth } = useTypedSelector(state => state.user);
  const { returnInputError, returnInputProperties, isValid, handleSubmit, getValues, setValue } = useCustomForm<IInputsLogin>();
   
  const logInAccount: SubmitHandler<IInputsLogin> = async () => {
    if (!isValid) return;

    const userInformation:ILogin  = {
      phone_number: selectPhone,
      password: getValues()?.password,
    };
    //Тут идут проверки на код в строке.
    //В редакс трудно на данный момент передать четко статус код
    try {
      onLogInUser(userInformation)
        .then(response => {
          if(response.payload?.access){
            showToastMessage("success", translate.messageLogInSuccess);
            return;
          };
          if (response.payload === 'Error: 403') {
            setCookie('userPhone',selectPhone);
            onSetRegistrationPage(3);
            push(REGISTRATION_ROUTE);
            getVerifySmsCode(getValues().phone_login_number);
            showToastMessage("warn", "Пользователь не подтвержден");
            return;
          }
          if (response.payload === 'Error: 401') {
            showToastMessage("error", translate.messageLogInError);
            return;
          };
          if (response.payload === 'Error: 401') {
            showToastMessage("error", 'Пользователь не найден');
            return;
          };
          switch (response.payload.state) {
            case "M":
              showToastMessage("warn", "Ваша заявка еще на модерации!");
              push(REGISTRATION_ROUTE);
              break;
            case "B":
              showToastMessage("warn", "Ваш аккаунт заблокирован!");
              push(REGISTRATION_ROUTE);
              break;
            case "C":
              showToastMessage("warn", "Ваша заявка отклонена!");
              push(REGISTRATION_ROUTE);
              break;
            case "F":
              showToastMessage("success", translate.messageLogInSuccess);
              push(PROVIDER_ROUTE);
              break;
            default:
              break;
          }
        })
        .catch(error => console.log(error));
      if(rememberMe) setCookie('userPhoneRemember',selectPhone);
    } catch (error) {
      console.error(error);
    }
  };
  const showModalForgetPassword = () => setForgetModal(!forgetModal);

  const redirectToRegistration = () => {
    onSetRegistrationPage(1);
    push(REGISTRATION_ROUTE);
  };
  //checkAuth
  useEffect(() => {
    onGetUser();
  }, [onGetUser]);

  useEffect(()=>{
    onSetForgetPassword(false);
  },[])

  useEffect(() => {
    if (isProviderAuth) {
      push(PROVIDER_ROUTE);
    }
  }, [isProviderAuth, push]);

  useEffect(() => {
    const savedUser = getCookie('userPhoneRemember');
      
    if (savedUser) setSelectPhone(savedUser);

    setValue('phone_login_number',selectPhone)
  },[rememberMe]);

  if (status === "pending" || isProviderAuth) return(
      <div className="products-content_spiner">
        <Icons id="spiner" />
      </div>
  );

  
  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit(logInAccount)} className="form-content">
        <div className="form-content_header">
          <h5 className="form-content_header-title">{translate.logInTitle}</h5>

          <p className="form-content_header-text">{translate.logInText}</p>
        </div>

        <div className="form-content_bottom">
        <label htmlFor="#" className="form-content_bottom-label">
            <span className="form-content_bottom-label-span">
              {translate.registrationPhoneNumber}
            </span>
                <input
                    {...returnInputProperties("phone_login_number")}
                    className="form-content-login-label-input phone"
                    type="tel"
                    onChange={event => setSelectPhone(event.target.value)}
                    placeholder={translate.registrationPhoneNumber}
                    value={selectPhone}
                    minLength={12}
                    maxLength={14}
                  />
                  {returnInputError("phone_login_number")}
          </label>

          <label htmlFor="#" className="form-content_bottom-label">
            <span className="form-content_bottom-label-span">
              {translate.logInLabelPassword}
            </span>

            <Input
              {...returnInputProperties("password")}
              placeholder={translate.logInLabelPassword}
              type="password"
              classNames={{ inputWrapper: "form-content_bottom-label-input" }}
            />
            {returnInputError("password")}
          </label>

          <div className="form-content_checkbox">
            <Checkbox
              className="form-content_checkbox-content"
              value="Запомнить пароль"
              checked={rememberMe}
              onChange={(event)=> setRememberMe(event.target.checked)}
            >
              {translate.logInCheckboxText}
            </Checkbox>
            {/* forget */}
            <button
              onClick={showModalForgetPassword}
              type="button"
              className="form-content_checkbox-button"
            >
              {translate.logInTextForget}
            </button>
          </div>

          <Button
            type="submit"
            className="bg-tiffani text-white rounded-md w-full h-[44px] py-[10px]"
          >
            {translate.logInButtonText}
          </Button>

          <Button
            onClick={redirectToRegistration}
            className="bg-transparent text-tiffani rounded-md w-full h-[44px] py-[10px]"
          >
            {translate.logInButtonRegistration}
          </Button>
        </div>
      </form>
      <ForgetPasswordModal
        forgetModal={forgetModal}
        setForgetModal={setForgetModal}
      />
    </div>
  );
};

export default LogInComponent;
