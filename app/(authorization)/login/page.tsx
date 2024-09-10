"use client";
//Global
import { useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import React, { useEffect, useState } from "react";
//Components
import InputMask from "react-input-mask";
import { Icons } from "@/components/Icons/Icons";
import { Checkbox, Button, Input , Select, SelectItem } from "@nextui-org/react";
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
import { Country } from "@/types/componentTypes";
//Prefixes
import prefixes from "@/locales/prefixes.json";
//Styles
import "./login.scss";

const LogIn: NextPage = () => {
  //Hooks
  const { push } = useRouter();
  const translate = useTranslate();
  const { onLogInUser, onSetRegistrationPage ,onSetForgetPassword,onGetUser} = useUserActions();
  const { isAuth, status } = useTypedSelector(state => state.user);
  const { returnInputError, returnInputProperties, isValid, handleSubmit, getValues, reset ,setValue} = useCustomForm<IInputsLogin>();

  const [forgetModal, setForgetModal] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [selectPhone,setSelectPhone] = useState<string>("");
  const [prefixCode,setPrefixCode] = useState<string>('+1');

  const selectClassName = {
    innerWrapper: "w-fit h-[30px]",
    popoverContent: "w-[130px] h-[250px]",
    mainWrapper: "w-[74px] h-[50px]",
    base: "w-[74px] h-[40px]",
    trigger: "rounded-tl-[10px] rounded-bl-[10px] rounded-tr-none rounded-br-none shadow-none w-[74px] h-[40px] border border-r-0"
  };

  const logInAccount: SubmitHandler<IInputsLogin> = () => {
    if(!isValid){
      showToastMessage('warn','Заполните все поля');
      return;
    };

    const phoneNumber = getValues().phone_login_number.replace(/[^\d+]/g, '');

    const requestBody = {
      phone_number:prefixCode + phoneNumber,
      password:getValues().password
    };

    try {
      onLogInUser(requestBody)
      .then(response => {
        if(response.payload?.access){
          showToastMessage("success", translate.messageLogInSuccess);
          return;
        };
        if(response.payload === 'Error: Не удалось обновить токен'){
          showToastMessage("warn", "Не удалось обновить токен");
          return;
        }
        if (response.payload === 'Error: 406') {
          setCookie('phoneNumber',selectPhone.replace(/[^\d+]/g, ''));
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
    if(rememberMe){
      setCookie('userPhoneRemember',selectPhone.replace(/[^\d+]/g, ''));
      setCookie('phonePrefix', prefixCode);
    }
  };
  const showModalForgetPassword = () => setForgetModal(!forgetModal);

  const renderAllPrefixes = () => {
    if (!prefixes.prefixes) return (
      <SelectItem key="+1" value="+1">
        Ошибка
      </SelectItem>
    );
  
    return (
      prefixes.prefixes?.map((country: Country) => (
        <SelectItem aria-label={`${country?.code}`} key={country?.code} value={`${country?.code}`}>
          <img src={country?.flag} alt={country?.name} className="inline-block w-4 h-4 mr-2" />
          {country?.code}
        </SelectItem>
      ))
    );
  };

  useEffect(()=>{
    onSetForgetPassword(false);
  },[])

  useEffect(() => {
    onGetUser();
  }, [onGetUser]);
  
  useEffect(() => {
    const savedUser = getCookie('userPhoneRemember');
    const savedPrfix = getCookie('phonePrefix');

      
    if (savedUser) setSelectPhone(savedUser);
    if (savedPrfix) setPrefixCode(savedPrfix);

    setValue('phone_login_number',String(savedUser))

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

           <div className="flex">
            <Select
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
