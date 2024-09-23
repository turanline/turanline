"use client";
//Global
import { useForm } from "react-hook-form";
//Types
import { IInputsLength,CustomFormType } from "@/types/types";
//Hooks
import { useTranslate } from "./useTranslate";
//Utils
import {
  emailRegular,
  passwordRegular,
  nameRegular,
  surnameRegular,
  phone_login_Regular,
  phoneRegular,
  addressRegular,
  companyNameRegular,
  codeRegular,
  cardNumberRegular,
  cardHolderNameRegular,
  cvvRegular,
  expirationDateRegular,
} from "@/utils/Consts";

const useCustomForm = <T extends CustomFormType>() => {
  const translate = useTranslate();
  const { register,formState: { errors, isValid },getValues,handleSubmit,reset,setValue } = useForm<T>({ mode: "onBlur" });

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
      case "phone_login_number":
        return phone_login_Regular;
      case "phone_number":
        return phoneRegular;
      case "address":
        return addressRegular;
      case "company":
        return companyNameRegular;
      case "code":
        return codeRegular;
      case "card_number":
        return cardNumberRegular; 
      case "cardholder_name":
        return cardHolderNameRegular; 
      case "cvv":
       return cvvRegular; 
      case "expiration_month":
        return expirationDateRegular; 
      case "expiration_year":
        return expirationDateRegular; 
    }
  };

  const returnMessageByInputType = (inputType: keyof IInputsLength) => {
    switch (inputType) {
      case "email":
        return translate.formEmail;
      case "first_name":
        return translate.formName;
      case "last_name":
        return translate.formName;
      case "password":
        return translate.formPassword;
      case "phone_number":
        return translate.formPhone;
      case "phone_login_number":
        return translate.formPhone;
      case "address":
        return translate.formAddress;
      case "company":
        return translate.formCompany;
      case "code":
        return translate.checkCode;
      case "card_number":
        return translate.formCorrectCardNumber; 
      case "cardholder_name":
        return translate.formCorrectCardName; 
      case "cvv":
       return translate.formCorrectCardCVV; 
      case "expiration_month":
        return translate.formCorrectCardMonth; 
      case "expiration_year":
        return translate.formCorrectCardYear; 
    }
    
  };

  const returnInputProperties = (inputType: keyof IInputsLength) => {
    const maxLengthInput: IInputsLength = {
      email: 150,
      first_name: 150,
      last_name: 150,
      password: 120,
      phone_login_number: 18,
      phone_number: 18,
      address: 150,
      company: 30,
      code:6,
      card_number:20,  
      cardholder_name:100,
      cvv:3,
      expiration_month:2,
      expiration_year:4,
    };

    const minLengthInput: IInputsLength = {
      email: 5,
      first_name: 2,
      last_name: 2,
      password: 8,
      phone_login_number: 10,
      phone_number: 10,
      address: 1,
      company: 1,
      code:6,
      card_number:16,  
      cardholder_name:5,
      cvv:3,
      expiration_month:2,
      expiration_year:4,
    };

    return {
      ...register(inputType as any, {
        required: translate.formRequired,
        minLength: {
          value: minLengthInput[inputType],
          message: `${translate.formMin} ${minLengthInput[inputType]} ${translate.formSymbols}`,
        },
        maxLength: {
          value: maxLengthInput[inputType],
          message: `${translate.formMax} ${maxLengthInput[inputType]} ${translate.formSymbols}`,
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
