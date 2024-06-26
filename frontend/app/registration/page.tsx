"use client";

//Global
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { showToastMessage } from "../toastsChange";

//Components
import { Icons } from "@/components/Icons/Icons";
import InputMask from "react-input-mask";
import { Checkbox, Button, Input } from "@nextui-org/react";

//Utils
import { LOGIN_ROUTE, PROFILE_ROUTE } from "@/utils/Consts";

//Hooks
import { useCustomForm } from "@/hooks/useCustomForm.";
import { useTranslate } from "@/hooks/useTranslate";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useUserActions } from "@/hooks/useUserActions";

//Types
import { IInputsRegistration } from "@/types/types";

//Styles
import "./registration.scss";

const Registration = () => {
  const { isAuth, status } = useTypedSelector(state => state.user);

  const {
    returnInputError,
    returnInputProperties,
    isValid,
    getValues,
    handleSubmit,
    reset,
    setValue,
  } = useCustomForm<IInputsRegistration>();

  const { onRegistrationUser } = useUserActions();

  const { push } = useRouter();

  useEffect(() => {
    if (isAuth && status === "fulfilled") push(PROFILE_ROUTE);
  }, [isAuth, status, push]);

  const {
    registrationButtonText,
    registrationInputEmail,
    registrationInputLastName,
    registrationInputName,
    registrationLabelEmail,
    registrationLabelLastName,
    registrationLabelName,
    registrationPhoneNumber,
    registrationTitle,
    logInLabelLogin,
    logInInputLogin,
    logInLabelPassword,
    logInInputPassword,
    logInCheckboxText,
    logInTextForget,
    registrationButtonLogIn,
    messageRegistrationError,
    messageRegistration,
  } = useTranslate();

  const createAccount = () => {
    const { email, first_name, last_name, password, phone_number, username } =
      getValues();

    if (isValid)
      onRegistrationUser(
        {
          phone_number,
          user: {
            email,
            first_name,
            is_provider: false,
            last_name,
            password,
            username,
          },
        },
        "customer"
      )
        .then(data => {
          if ("error" in data && data.error.message === "Rejected") {
            showToastMessage("error", messageRegistrationError);
          } else {
            showToastMessage("success", messageRegistration);
            push(LOGIN_ROUTE);
          }
        })
        // eslint-disable-next-line no-console
        .catch(error => console.log(error))
        .finally(() => {
          setValue("phone_number", "");
          reset();
        });
  };

  if (isAuth || status === "pending") return <Icons id="spiner" />;

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit(createAccount)} className="form-content">
        <div className="form-content_header">
          <h5 className="form-content_header-title">{registrationTitle}</h5>

          <p className="form-content_header-text">{registrationButtonText}</p>
        </div>

        <div className="form-content_bottom">
          <label htmlFor="#" className="form-content_bottom-label">
            <span className="form-content_bottom-label-span">
              {registrationLabelEmail}
            </span>

            <Input
              {...returnInputProperties("email")}
              placeholder={registrationInputEmail}
              type="email"
              classNames={{ inputWrapper: "form-content_bottom-label-input" }}
            />
            {returnInputError("email")}
          </label>

          <label htmlFor="#" className="form-content_bottom-label">
            <span className="form-content_bottom-label-span">
              {logInLabelPassword}
            </span>

            <Input
              {...returnInputProperties("password")}
              placeholder={logInInputPassword}
              type="password"
              classNames={{ inputWrapper: "form-content_bottom-label-input" }}
            />
            {returnInputError("password")}
          </label>

          <label htmlFor="#" className="form-content_bottom-label">
            <span className="form-content_bottom-label-span">
              {logInLabelLogin}
            </span>

            <Input
              {...returnInputProperties("username")}
              placeholder={logInInputLogin}
              classNames={{ inputWrapper: "form-content_bottom-label-input" }}
            />
            {returnInputError("username")}
          </label>

          <label htmlFor="#" className="form-content_bottom-label">
            <span className="form-content_bottom-label-span">
              {registrationLabelName}
            </span>

            <Input
              {...returnInputProperties("first_name")}
              placeholder={registrationInputName}
              classNames={{ inputWrapper: "form-content_bottom-label-input" }}
            />
            {returnInputError("first_name")}
          </label>

          <label htmlFor="#" className="form-content_bottom-label">
            <span className="form-content_bottom-label-span">
              {registrationLabelLastName}
            </span>

            <Input
              {...returnInputProperties("last_name")}
              placeholder={registrationInputLastName}
              classNames={{ inputWrapper: "form-content_bottom-label-input" }}
            />
            {returnInputError("last_name")}
          </label>

          <label htmlFor="#" className="form-content_bottom-label">
            <span className="form-content_bottom-label-span">
              {registrationPhoneNumber}
            </span>

            <InputMask
              {...returnInputProperties("phone_number")}
              className="form-content_bottom-label-input"
              mask={"+7 (999) 999-99-99"}
              alwaysShowMask={true}
            />
            {returnInputError("phone_number")}
          </label>

          <div className="form-content_checkbox">
            <Checkbox
              className="form-content_checkbox-content"
              value="Запомнить пароль"
            >
              {logInCheckboxText}
            </Checkbox>

            <button className="form-content_checkbox-button">
              {logInTextForget}
            </button>
          </div>

          <Button
            type="submit"
            className="bg-tiffani text-white rounded-md w-full h-[44px] py-[10px]"
          >
            {registrationButtonText}
          </Button>

          <Button
            onClick={() => push(LOGIN_ROUTE)}
            className="rounded-md w-full h-[44px] py-[10px] text-tiffani bg-transparent"
          >
            {registrationButtonLogIn}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Registration;
