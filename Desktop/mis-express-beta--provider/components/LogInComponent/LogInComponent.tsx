"use client";
//Global
import { useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import React, { FC, useEffect, useState } from "react";
import { showToastMessage } from "@/app/toastsChange";
//Components
import { Icons } from "@/components/Icons/Icons";
import InputMask from "react-input-mask";
import { Checkbox, Button, Input,Select, SelectItem} from "@nextui-org/react";
import ForgetPasswordModal from "../Modals/ForgetPasswordModal/ForgetPasswordModal";
//Cookies
import { getCookie, setCookie } from 'cookies-next';
//Utils
import {
  PROVIDER_ROUTE,
  REGISTRATION_ROUTE,
} from "@/utils/Consts";
//Hooks
import { useCustomForm } from "@/hooks/useCustomForm.";
import { useTranslate } from "@/hooks/useTranslate";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useUserActions } from "@/hooks/useUserActions";
import { useLanguage } from "@/hooks/useLanguage";
//Prefixes
import prefixes from "@/locales/prefixes.json";
//Types
import { IInputsLogin, ILogin } from "@/types/additionalTypes";
import { Country } from "@/types/componentsTypes";
//Styles
import "./LoginComponent.scss";



export const LogInComponent: FC = () => {
  const [forgetModal, setForgetModal] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [selectPhone,setSelectPhone] = useState<string>('');
  const [prefixCode,setPrefixCode] = useState<string>('+1');
  //hooks
  const { push } = useRouter();
  const translate = useTranslate();
  const { onLogInUser, onGetUser ,onSetRegistrationPage,onSetForgetPassword} = useUserActions();
  const { status, isProviderAuth } = useTypedSelector(state => state.authorization);
 

  const { returnInputError, returnInputProperties, isValid, handleSubmit, getValues, setValue } = useCustomForm<IInputsLogin>();
  
  const selectClassName = {
    innerWrapper: "w-fit h-[30px]",
    popoverContent: "w-[130px] h-[250px]",
    mainWrapper: "w-[74px] h-[50px]",
    base: "w-[74px] h-[40px]",
    trigger: "rounded-tl-[10px] rounded-bl-[10px] rounded-tr-none rounded-br-none shadow-none w-[74px] h-[40px] border border-r-0"
  };
  const logInAccount: SubmitHandler<IInputsLogin> = async () => {
    if (!isValid){
      showToastMessage('warn',translate.notifyFillFields)
      return;
    }

    const userInformation:ILogin  = {
      phone_number: (prefixCode + selectPhone).replace(/[^\d+]/g, ''),
      password: getValues()?.password,
    };

    try {
      await onLogInUser(userInformation,{rememberMe, selectPhone, prefixCode});
    
    } catch (error) {
      console.error(error);
    }
  };
  const showModalForgetPassword = () => setForgetModal(!forgetModal);

  const redirectToRegistration = () => {
    onSetRegistrationPage(1);
    push(REGISTRATION_ROUTE);
  };
  const renderAllPrefixes = () => {
    if (!prefixes.prefixes) return (
      <SelectItem aria-labelledby="country" key="+1" value="+1">
        Ошибка
      </SelectItem>
    );
  
    return (
      prefixes.prefixes?.map((country: Country) => (
        <SelectItem aria-labelledby="country" aria-label={`${country?.code}`} key={country?.code} value={`${country?.code}`}>
          <img src={country?.flag} alt={country?.name} className="inline-block w-4 h-4 mr-2" />
          {country?.code}
        </SelectItem>
      ))
    );
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
    const savedPhone = getCookie('userPhoneRemember');
    const savedPrefix = getCookie('phonePrefix');
      
    if (savedPhone) setSelectPhone(savedPhone);
    if (savedPrefix) setPrefixCode(savedPrefix);

    setValue('phone_login_number',String(savedPhone))
    
  },[]);


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
            <div className="flex">
            <Select
                aria-label="select-prefix"
                radius="none"
                disallowEmptySelection
                defaultSelectedKeys={[prefixCode]}
                classNames={selectClassName}
                onChange={event => setPrefixCode(event.target.value)}
              >
                {renderAllPrefixes()}
              </Select>

              <InputMask
                {...returnInputProperties("phone_login_number")}
                data-phone
                value={selectPhone}
                className="form-content-login-label-input-phone"
                mask='(999) 999-99-99'
                alwaysShowMask={true}
                onChange={event => setSelectPhone(event.target.value)}
              />
           </div>
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
