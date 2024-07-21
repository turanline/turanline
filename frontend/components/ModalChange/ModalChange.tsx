"use client";

//Global
import { showToastMessage } from "@/app/toastsChange";
import { FC } from "react";

//Components
import InputMask from "react-input-mask";
import { Icons } from "../Icons/Icons";
import { Button, Input } from "@nextui-org/react";

//Global Types
import { IChangeUserData, IInputsChangeProfile } from "@/types/types";

//Component Types
import { IModalChangeProps } from "@/types/componentTypes";

//Hooks
import { useTranslate } from "@/hooks/useTranslate";
import { useCustomForm } from "@/hooks/useCustomForm.";
import { useUserActions } from "@/hooks/useUserActions";

//Styles
import "./ModalChange.scss";

const ModalChange: FC<IModalChangeProps> = ({ isChange, setIsChange }) => {
  const {
    profileModalAddress,
    profileModalButton,
    profileModalCompany,
    profileModalName,
    profileModalSurName,
    profileModalTitle,
    messageModalChangeWarn,
  } = useTranslate();

  const {
    getValues,
    handleSubmit,
    reset,
    setValue,
    isValid,
    returnInputError,
    returnInputProperties,
  } = useCustomForm<IInputsChangeProfile>();

  const { onChangeUserData } = useUserActions();

  const handleChangeUserData = () => {
    const { address, company, first_name, last_name, phone_number } =
      getValues();

    const requestBody: IChangeUserData = {
      user: { first_name, last_name },
      address,
      company,
      phone_number,
    };

    if (!isValid) {
      showToastMessage("warn", messageModalChangeWarn);
      return;
    }

    onChangeUserData(requestBody, reset, setValue, setIsChange);
  };

  return (
    <div
      onClick={() => setIsChange(false)}
      className={!isChange ? "change-wrapper" : "change-wrapper active"}
    >
      <form
        className={!isChange ? "change-content" : "change-content active"}
        onClick={e => e.stopPropagation()}
        onSubmit={handleSubmit(handleChangeUserData)}
      >
        <h3 className="change-content-title">{profileModalTitle}</h3>

        <label className="w-full" htmlFor="#">
          <Input
            {...returnInputProperties("first_name")}
            placeholder={`${profileModalName}...`}
            name="first_name"
            classNames={{ inputWrapper: "change-content-input" }}
            type="text"
          />
          {returnInputError("first_name")}
        </label>

        <label className="w-full" htmlFor="#">
          <Input
            {...returnInputProperties("last_name")}
            placeholder={`${profileModalSurName}...`}
            name="last_name"
            classNames={{ inputWrapper: "change-content-input" }}
            type="text"
          />
          {returnInputError("last_name")}
        </label>

        <label className="w-full" htmlFor="#">
          <Input
            {...returnInputProperties("company")}
            placeholder={`${profileModalCompany}...`}
            name="company"
            classNames={{ inputWrapper: "change-content-input" }}
            type="text"
          />
          {returnInputError("company")}
        </label>

        <label className="w-full" htmlFor="#">
          <Input
            {...returnInputProperties("address")}
            placeholder={`${profileModalAddress}...`}
            name="address"
            classNames={{ inputWrapper: "change-content-input" }}
            type="text"
          />
          {returnInputError("address")}
        </label>

        <label className="w-full" htmlFor="#">
          <InputMask
            {...returnInputProperties("phone_number")}
            name="phone_number"
            className="change-content-input"
            mask={"+7 (999) 999-99-99"}
            alwaysShowMask={true}
          />
          {returnInputError("phone_number")}
        </label>

        <Button type="submit" className="bg-tiffani text-white w-full">
          {profileModalButton}
        </Button>

        <button
          onClick={() => setIsChange(false)}
          type="button"
          className="delete-card-button"
        >
          <Icons id="deleteCard" />
        </button>
      </form>
    </div>
  );
};

export { ModalChange };
