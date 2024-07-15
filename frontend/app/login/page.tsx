"use client";

//Global
import { useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import React, { useEffect } from "react";

//Components
import { Icons } from "@/components/Icons/Icons";
import { Checkbox, Button, Input } from "@nextui-org/react";
import { NextPage } from "next";

//Utils
import { REGISTRATION_ROUTE, SHOP_ROUTE } from "@/utils/Consts";

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
  const { isAuth, status } = useTypedSelector(state => state.user);

  const { push } = useRouter();

  const { onLogInUser } = useUserActions();

  const {
    returnInputError,
    returnInputProperties,
    isValid,
    handleSubmit,
    getValues,
    reset,
  } = useCustomForm<IInputsLogin>();

  useEffect(() => {
    if (status === "fulfilled" && isAuth) push(SHOP_ROUTE);
  }, [isAuth, status, push]);

  const {
    logInButtonText,
    logInCheckboxText,
    logInInputLogin,
    logInLabelLogin,
    logInLabelPassword,
    logInText,
    logInTextForget,
    logInTitle,
    logInButtonRegistration,
  } = useTranslate();

  const logInAccount: SubmitHandler<IInputsLogin> = () =>
    isValid && onLogInUser(getValues(), reset);

  if (status === "pending" || isAuth) return <Icons id="spiner" />;

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit(logInAccount)} className="form-content">
        <div className="form-content_header">
          <h5 className="form-content_header-title">{logInTitle}</h5>

          <p className="form-content_header-text">{logInText}</p>
        </div>

        <div className="form-content_bottom">
          <label htmlFor="#" className="form-content_bottom-label">
            <span className="form-content_bottom-label-span">
              {logInLabelLogin}
            </span>

            <Input
              {...returnInputProperties("username")}
              placeholder={logInInputLogin}
              type="username"
              classNames={{ inputWrapper: "form-content_bottom-label-input" }}
            />
            {returnInputError("username")}
          </label>

          <label htmlFor="#" className="form-content_bottom-label">
            <span className="form-content_bottom-label-span">
              {logInLabelPassword}
            </span>

            <Input
              {...returnInputProperties("password")}
              placeholder={logInLabelPassword}
              type="password"
              classNames={{ inputWrapper: "form-content_bottom-label-input" }}
            />
            {returnInputError("password")}
          </label>

          <div className="form-content_checkbox">
            <Checkbox
              className="form-content_checkbox-content"
              value="Запомнить пароль"
            >
              {logInCheckboxText}
            </Checkbox>

            <button type="button" className="form-content_checkbox-button">
              {logInTextForget}
            </button>
          </div>

          <Button
            type="submit"
            className="bg-tiffani text-white rounded-md w-full h-[44px] py-[10px]"
          >
            {logInButtonText}
          </Button>

          <Button
            onClick={() => push(REGISTRATION_ROUTE)}
            className="bg-transparent text-tiffani rounded-md w-full h-[44px] py-[10px]"
          >
            {logInButtonRegistration}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LogIn;
