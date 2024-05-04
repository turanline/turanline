"use client";

//Global
import React, {
  ChangeEvent,
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { Checkbox, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { showToastMessage } from "../toastsChange";
import InputMask from "react-input-mask";
import { SidebarContext } from "../layout";
import { getUser } from "../layout";
import { SubmitHandler, useForm } from "react-hook-form";

//Components
import { Icons } from "@/components/Icons/Icons";

//Services
import { postRegistration } from "@/services/usersAPI";

//Utils
import { SHOP_ROUTE, LOGIN_ROUTE } from "@/utils/Consts";

//Hooks
import { useCustomForm } from "@/hooks/useCustomForm.";
import { useTranslate } from "@/hooks/useTranslate";

//Types
import { IUserInformationApi } from "@/types/types";

//Styles
import "./registration.scss";

const Registration = () => {
  const { handleSubmit } = useForm<IUserInformationApi>({ defaultValues: {} });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { isActive, setIsActive } = useContext(SidebarContext);

  const { returnInputError, returnInputProperties } = useCustomForm();

  const { push } = useRouter();

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
  } = useTranslate();

  const [userInformation, setUserInformation] = useState({
    email: "",
    password: "",
    username: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  });

  const changeUserInformation = (
    e: ChangeEvent<HTMLInputElement>,
    setInformation: Dispatch<SetStateAction<any>>,
    information: IUserInformationApi
  ) => {
    e.preventDefault();

    setInformation({
      ...information,
      [e.target.name]: e.target.value,
    });
  };

  const createAccount: SubmitHandler<IUserInformationApi> = () => {
    try {
      postRegistration(userInformation)
        .then(() => {
          push(LOGIN_ROUTE);
          showToastMessage("success", "Вы успешно зарегистрировались");
        })
        .catch(error => {
          console.log(error);

          showToastMessage(
            "error",
            "Ошибка, заполните все поля и попробуйте снова!"
          );
        });
    } catch (error) {
      throw new Error(`${error}`);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { status } = await getUser();

        if (status === 200) {
          push(SHOP_ROUTE);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error as Error);
        setIsActive(false);
        setIsLoading(false);
      }
    })();
  }, [setIsActive]);

  if (isActive || isLoading) return <Icons id="spiner" />;

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
            <input
              {...returnInputProperties("email")}
              placeholder={registrationInputEmail}
              type="email"
              className="form-content_bottom-label-input"
              onChange={e => {
                changeUserInformation(e, setUserInformation, userInformation);
              }}
            />
            {returnInputError("email")}
          </label>

          <label htmlFor="#" className="form-content_bottom-label">
            <span className="form-content_bottom-label-span">
              {logInLabelPassword}
            </span>
            <input
              {...returnInputProperties("password")}
              placeholder={logInInputPassword}
              type="password"
              className="form-content_bottom-label-input"
              onChange={e => {
                changeUserInformation(e, setUserInformation, userInformation);
              }}
            />
            {returnInputError("password")}
          </label>

          <label htmlFor="#" className="form-content_bottom-label">
            <span className="form-content_bottom-label-span">
              {logInLabelLogin}
            </span>
            <input
              {...returnInputProperties("username")}
              placeholder={logInInputLogin}
              type="text"
              className="form-content_bottom-label-input"
              onChange={e => {
                changeUserInformation(e, setUserInformation, userInformation);
              }}
            />
            {returnInputError("username")}
          </label>

          <label htmlFor="#" className="form-content_bottom-label">
            <span className="form-content_bottom-label-span">
              {registrationLabelName}
            </span>
            <input
              {...returnInputProperties("first_name")}
              placeholder={registrationInputName}
              type="text"
              className="form-content_bottom-label-input"
              onChange={e => {
                changeUserInformation(e, setUserInformation, userInformation);
              }}
            />
            {returnInputError("first_name")}
          </label>

          <label htmlFor="#" className="form-content_bottom-label">
            <span className="form-content_bottom-label-span">
              {registrationLabelLastName}
            </span>
            <input
              {...returnInputProperties("last_name")}
              placeholder={registrationInputLastName}
              type="text"
              className="form-content_bottom-label-input"
              onChange={e => {
                changeUserInformation(e, setUserInformation, userInformation);
              }}
            />
            {returnInputError("last_name")}
          </label>

          <label htmlFor="#" className="form-content_bottom-label">
            <span className="form-content_bottom-label-span">
              {registrationPhoneNumber}
            </span>
            <InputMask
              className="form-content_bottom-label-input"
              onChange={e => {
                changeUserInformation(e, setUserInformation, userInformation);
              }}
              type="tel"
              mask={"+7 (999) 999-99-99"}
              alwaysShowMask={true}
              name="phone_number"
            />
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
            onClick={handleSubmit(createAccount)}
            type="submit"
            className="bg-tiffani text-white rounded-md w-full h-[44px] py-[10px]"
          >
            {registrationButtonText}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Registration;
