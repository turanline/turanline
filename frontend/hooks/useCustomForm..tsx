"use client";

//Global
import { useForm } from "react-hook-form";

//Types
import {
  IInputsLength,
  CustomFormType,
  IInputsChangeProfile,
} from "@/types/types";

//Hooks
import { useTranslate } from "./useTranslate";

//Utils
import {
  emailRegular,
  passwordRegular,
  nameRegular,
  surnameRegular,
  usernameRegular,
  phoneRegular,
  addressRegular,
  companyNameRegular,
} from "@/utils/Consts";

const useCustomForm = <T extends CustomFormType>() => {
  const {
    register,
    formState: { errors, isValid },
    getValues,
    handleSubmit,
    reset,
    setValue,
  } = useForm<T>({ mode: "onBlur" });

  const {
    formAddress,
    formCompany,
    formEmail,
    formName,
    formPassword,
    formPhone,
    formUsername,
    formMax,
    formMin,
    formRequired,
    formSymbols,
  } = useTranslate();

  const returnRegularByInputType = (inputType: keyof IInputsLength) => {
    switch (inputType) {
      case "email":
        return emailRegular;
      case "first_name":
        return nameRegular;
      case "last_name":
        return surnameRegular;
      case "password":
        return passwordRegular;
      case "username":
        return usernameRegular;
      case "phone_number":
        return phoneRegular;
      case "address":
        return addressRegular;
      case "company":
        return companyNameRegular;
    }
  };

  const returnMessageByInputType = (inputType: keyof IInputsLength) => {
    switch (inputType) {
      case "email":
        return formEmail;
      case "first_name":
        return formName;
      case "last_name":
        return formName;
      case "password":
        return formPassword;
      case "username":
        return formUsername;
      case "phone_number":
        return formPhone;
      case "address":
        return formAddress;
      case "company":
        return formCompany;
    }
  };

  const returnInputProperties = (inputType: keyof IInputsLength) => {
    const maxLengthInput: IInputsLength = {
      email: 150,
      first_name: 150,
      last_name: 150,
      password: 120,
      username: 150,
      phone_number: 18,
      address: 150,
      company: 30,
    };

    const minLengthInput: IInputsLength = {
      email: 5,
      first_name: 2,
      last_name: 2,
      password: 8,
      username: 3,
      phone_number: 6,
      address: 1,
      company: 1,
    };

    return {
      ...register(inputType as any, {
        required: formRequired,
        minLength: {
          value: minLengthInput[inputType],
          message: `${formMin} ${minLengthInput[inputType]} ${formSymbols}`,
        },
        maxLength: {
          value: maxLengthInput[inputType],
          message: `${formMax} ${maxLengthInput[inputType]} ${formSymbols}`,
        },
        pattern: {
          value: returnRegularByInputType(inputType),
          message: returnMessageByInputType(inputType),
        },
      }),
    };
  };

  const returnInputError = (inputType: keyof T) => (
    <span style={{ textAlign: "left", color: "red", fontSize: "12px" }}>
      {errors[inputType]?.message?.toString()}
    </span>
  );

  return {
    returnInputError,
    returnInputProperties,
    isValid,
    getValues,
    handleSubmit,
    reset,
    setValue,
  };
};

export { useCustomForm };
