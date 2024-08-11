"use client";
//Global
import { useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import React, { useEffect, useState } from "react";
//Components
import { Icons } from "@/components/Icons/Icons";
import { Checkbox, Button, Input } from "@nextui-org/react";
import { NextPage } from "next";
import { setCookie ,getCookie} from "cookies-next";
import { showToastMessage } from "../toastsChange";
import ForgetPasswordModal from "@/components/Modals/ForgetPasswordModal/ForgetPasswordModal";
//Utils
import { REGISTRATION_ROUTE, PROFILE_ROUTE } from "@/utils/Consts";
//Services
import { getVerifySmsCode } from "@/services/authAPI";
//Hooks
import { useCustomForm } from "@/hooks/useCustomForm.";
import { useTranslate } from "@/hooks/useTranslate";
import { useTypedSelector } from "@/hooks/useReduxHooks";
import { useUserActions } from "@/hooks/useUserActions";
//Global Types
import { IInputsLogin } from "@/types/types";
//Styles
import "../../app/login/login.scss";

const LogIn: NextPage = () => {
  //Hooks
  const { push } = useRouter();
  const translate = useTranslate();
  const { onLogInUser, onSetRegistrationPage ,onSetForgetPassword} = useUserActions();
  const { isAuth, status } = useTypedSelector(state => state.user);
  const { returnInputError, returnInputProperties, isValid, handleSubmit, getValues, reset ,setValue} = useCustomForm<IInputsLogin>();

  const [forgetModal, setForgetModal] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [selectPhone,setSelectPhone] = useState<string>("");

  const logInAccount: SubmitHandler<IInputsLogin> = () => {
    if(!isValid) return;

    try {
      onLogInUser({phone_number:getValues().phone_login_number,password:getValues().password})
      .then(response => {
        if(response.payload?.access){
          showToastMessage("success", translate.messageLogInSuccess);
          return;
        };
        if (response.payload === 'Error: 403') {
          setCookie('userPhone',selectPhone);
          onSetRegistrationPage(2);
          push(REGISTRATION_ROUTE);
          getVerifySmsCode(selectPhone,'verification');
          showToastMessage("warn", "Пользователь не подтвержден");
          return;
        }
        if (response.payload === 'Error: 401') {
          showToastMessage("error", translate.messageLogInError);
          return;
        };
        if (response.payload === 'Error: 404') {
          showToastMessage("error", 'Пользователь не найден');
          return;
        };
      });
      
    }catch (error) {
      console.error(error);
    }
    if(rememberMe) setCookie('userPhone',selectPhone);

  };

  const showModalForgetPassword = () => setForgetModal(!forgetModal);

  useEffect(()=>{
    onSetForgetPassword(false);
  },[])
  useEffect(() => {
    const savedUser = getCookie('userPhoneRemember');
      
    if (savedUser) setSelectPhone(savedUser);

    setValue('phone_login_number',selectPhone)
  },[rememberMe]);

  useEffect(() => {
    if (status === "fulfilled" && isAuth) push(PROFILE_ROUTE);
  }, [isAuth, status, push]);

  if (status === "pending" || isAuth) return <Icons id="spiner" />;

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

            <button onClick={showModalForgetPassword} type="button" className="form-content_checkbox-button">
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
            onClick={() => push(REGISTRATION_ROUTE)}
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

export default LogIn;
