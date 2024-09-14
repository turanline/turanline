"use client";

//Global
import { showToastMessage } from "@/app/toastsChange";
import { FC } from "react";

//Components
import InputMask from "react-input-mask";
import { Icons } from "../Icons/Icons";
import { Button } from "@nextui-org/react";

//Types
import { IInputsChangeProfile, IModalChangeProps } from "@/types/types";

//Hooks
import { useTranslate } from "@/hooks/useTranslate";
import { useCustomForm } from "@/hooks/useCustomForm.";
import { useUserActions } from "@/hooks/useUserActions";
import { useTypedSelector } from "@/hooks/useTypedSelector";

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
    messageModalChangeError,
    messageModalChangeSuccess,
    messageModalChangeWarn,
  } = useTranslate();

  const {
    getValues,
    reset,
    handleSubmit,
    isValid,
    setValue,
    returnInputError,
    returnInputProperties,
  } = useCustomForm<IInputsChangeProfile>();

  const { onChangeUserData } = useUserActions();

  const handleChangeUserData = async () => {
    const { address, company, first_name, last_name, phone_number } =
      getValues();

    if (isValid) {
      onChangeUserData({
        user: { first_name, last_name },
        address,
        company,
        phone_number,
      })
        .then(data => {
          if ("error" in data && data.error.message === "Rejected") {
            showToastMessage("error", messageModalChangeError);
          } else {
            showToastMessage("success", messageModalChangeSuccess);
            setIsChange(false);
            setValue("phone_number", "");
            reset();
          }
        })
        // eslint-disable-next-line no-console
        .catch(error => console.log(error))
        .finally(() => {
          setValue("phone_number", "");
          reset();
        });
    } else {
      showToastMessage("warn", messageModalChangeWarn);
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
        onSubmit={handleSubmit(handleChangeUserData)}
      >
        <h3 className="change-content-title">{profileModalTitle}</h3>

        <label className="w-full" htmlFor="#">
          <input
            {...returnInputProperties("first_name")}
            placeholder={`${profileModalName}...`}
            name="first_name"
            className="change-content-input"
            type="text"
          />
          {returnInputError("first_name")}
        </label>

        <label className="w-full" htmlFor="#">
          <input
            {...returnInputProperties("last_name")}
            placeholder={`${profileModalSurName}...`}
            name="last_name"
            className="change-content-input"
            type="text"
          />
          {returnInputError("last_name")}
        </label>

        <label className="w-full" htmlFor="#">
          <input
            {...returnInputProperties("company")}
            placeholder={`${profileModalCompany}...`}
            name="company"
            className="change-content-input"
            type="text"
          />
          {returnInputError("company")}
        </label>

        <label className="w-full" htmlFor="#">
          <input
            {...returnInputProperties("address")}
            placeholder={`${profileModalAddress}...`}
            name="address"
            className="change-content-input"
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
          className="delete-card-button"
        >
          <Icons id="deleteCard" />
        </button>
      </form>
    </div>
  );
};

export { ModalChange };
