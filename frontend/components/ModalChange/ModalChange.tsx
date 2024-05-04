"use client";

//Global
import { showToastMessage } from "@/app/toastsChange";
import { FC, FormEvent } from "react";

//Components
import InputMask from "react-input-mask";
import { Icons } from "../Icons/Icons";
import { Button } from "@nextui-org/react";

//Types
import { IModalChangeProps, IProfileInputs } from "@/types/types";

//Hooks
import { useTranslate } from "@/hooks/useTranslate";

//Services
import { changeUserData } from "@/services/usersAPI";
import { postVerifyToken } from "@/services/authAPI";

//Styles
import "./ModalChange.scss";

const ModalChange: FC<IModalChangeProps> = props => {
  const {
    setIsChange,
    isChange,
    handleInputsChange,
    inputsValue,
    setUserState,
    userState,
    setInputsValue,
  } = props;

  const {
    profileModalAddress,
    profileModalButton,
    profileModalCompany,
    profileModalName,
    profileModalSurName,
    profileModalTitle,
  } = useTranslate();

  const { address, company, first_name, last_name, phone_number } = inputsValue;

  const checkAllFieldsFilled = (obj: IProfileInputs) => {
    for (let key in obj) {
      if (
        typeof obj[key as keyof IProfileInputs] !== "string" ||
        obj[key as keyof IProfileInputs].trim() === ""
      ) {
        console.error("Ошибка: Не все поля заполнены");
        return false;
      }
    }
    return true;
  };

  const clearInputs = () =>
    setInputsValue({
      address: "",
      company: "",
      phone_number: "",
      first_name: "",
      last_name: "",
    });

  const handleChangeUserData = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const areFilled = checkAllFieldsFilled(inputsValue);

    if (areFilled) {
      const token = localStorage.getItem("AuthTokenMis");

      if (token) {
        const { user } = await postVerifyToken(token);

        await changeUserData(user, inputsValue, token)
          .then(() => {
            userState &&
              setUserState({
                ...userState,
                ...inputsValue,
              });

            showToastMessage("success", "Данные успешно изменены!");
            setIsChange(false);
          })
          .catch(e => console.log(e))
          .finally(() => clearInputs());
      }
    } else {
      showToastMessage("warn", "Все поля обязательно должны быть заполнены!");
    }
  };

  return (
    <div
      onClick={() => setIsChange(false)}
      className={!isChange ? "change-wrapper" : "change-wrapper active"}
    >
      <form
        className={!isChange ? "change-content" : "change-content active"}
        onClick={e => e.stopPropagation()}
        onSubmit={e => handleChangeUserData(e)}
      >
        <h3 className="change-content-title">{profileModalTitle}</h3>

        <input
          placeholder={`${profileModalName}...`}
          name="first_name"
          className="change-content-input"
          type="text"
          onChange={e => handleInputsChange(e)}
          value={first_name}
        />

        <input
          placeholder={`${profileModalSurName}...`}
          name="last_name"
          className="change-content-input"
          type="text"
          onChange={e => handleInputsChange(e)}
          value={last_name}
        />

        <input
          placeholder={`${profileModalCompany}...`}
          name="company"
          className="change-content-input"
          type="text"
          onChange={e => handleInputsChange(e)}
          value={company}
        />

        <InputMask
          name="phone_number"
          className="change-content-input"
          type="text"
          onChange={e => handleInputsChange(e)}
          mask={"+7 (999) 999-99-99"}
          alwaysShowMask={true}
          value={phone_number}
        />

        <input
          placeholder={`${profileModalAddress}...`}
          name="address"
          className="change-content-input"
          type="text"
          onChange={e => handleInputsChange(e)}
          value={address}
        />

        <Button type="submit" className="submit-change">
          {profileModalButton}
        </Button>

        <button
          type="button"
          onClick={() => setIsChange(false)}
          className="delete-card-button"
        >
          <Icons id="deleteCard" />
        </button>
      </form>
    </div>
  );
};

export { ModalChange };
