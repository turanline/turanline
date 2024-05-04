"use client";

//Global
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { Checkbox, Button } from "@nextui-org/react";
import { getUser } from "../layout";
import { SidebarContext } from "../layout";
import { showToastMessage } from "../toastsChange";
import React, {
  ChangeEvent,
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

//Services
import { postLogin } from "@/services/authAPI";

//Components
import { Icons } from "@/components/Icons/Icons";

//Utils
import { SHOP_ROUTE, PROFILE_ROUTE } from "@/utils/Consts";

//Hooks
import { useCustomForm } from "@/hooks/useCustomForm.";
import { useTranslate } from "@/hooks/useTranslate";

//Types
import { IInputsLogin } from "@/types/types";

//Styles
import "./authorization.scss";

const Authorization = () => {
  const router = useRouter();

  const { setIsActive, isActive } = useContext(SidebarContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { handleSubmit } = useForm<IInputsLogin>({ defaultValues: {} });

  const { returnInputError, returnInputProperties } = useCustomForm();

  const {
    logInButtonText,
    logInCheckboxText,
    logInInputLogin,
    logInInputPassword,
    logInLabelLogin,
    logInLabelPassword,
    logInText,
    logInTextForget,
    logInTitle,
  } = useTranslate();

  const [userInformation, setUserInformation] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const { status } = await getUser();

        if (status === 200) router.push(SHOP_ROUTE);
        else setIsLoading(false);
      } catch (error) {
        setIsActive(false);
        setIsLoading(false);
        throw new Error(`${error}`);
      }
    })();
  }, [router, setIsActive]);

  const changeUserInformation = (
    e: ChangeEvent<HTMLInputElement>,
    setInformation: Dispatch<SetStateAction<any>>,
    information: IInputsLogin
  ) => {
    e.preventDefault();

    setInformation({
      ...information,
      [e.target.name]: e.target.value,
    });
  };

  const logInAccount: SubmitHandler<IInputsLogin> = () => {
    try {
      postLogin(userInformation)
        .then(() => {
          setIsActive(true);
          router.push(PROFILE_ROUTE);
          showToastMessage("success", "Вы успешно авторизовались");
        })
        .catch(error => {
          console.log(error);

          showToastMessage(
            "error",
            "Произошла ошибка, заполните все поля и попробуйте снова!"
          );
        });
    } catch (error) {
      throw new Error(`${error}`);
    }
  };

  if (isActive || isLoading) return <Icons id="spiner" />;

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
            <input
              {...returnInputProperties("username")}
              placeholder={logInInputLogin}
              type="username"
              className="form-content_bottom-label-input"
              onChange={e => {
                changeUserInformation(e, setUserInformation, userInformation);
              }}
            />
            {returnInputError("username")}
          </label>

          <label htmlFor="#" className="form-content_bottom-label">
            <span className="form-content_bottom-label-span">
              {logInLabelPassword}
            </span>
            <input
              {...returnInputProperties("password")}
              placeholder={logInLabelPassword}
              type="password"
              className="form-content_bottom-label-input"
              onChange={e => {
                changeUserInformation(e, setUserInformation, userInformation);
              }}
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

            <button className="form-content_checkbox-button">
              {logInTextForget}
            </button>
          </div>

          <Button
            type="submit"
            className="bg-tiffani text-white rounded-md w-full h-[44px] py-[10px]"
          >
            {logInButtonText}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Authorization;
