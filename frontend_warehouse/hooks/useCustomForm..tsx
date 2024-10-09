"use client";
//Global
import { useForm } from "react-hook-form";
//Types
import { IInputsLength, CustomFormType } from "@/types/additionalTypes";
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
  compoundRegular,
  articleRegular,
  seasonRegular,
  brandRegular,
  patternRegular,
  countryRegular,
  priceRegular,
  codeRegular,
  weightRegular,
  titleRegular,
  descriptionRegular,
  clothesSizeRegular
} from "@/utils/Consts";

const useCustomForm = <T extends CustomFormType>() => {

  const {register,formState: { errors, isValid },getValues,handleSubmit,reset,setValue,} = useForm<T>({ mode: "onBlur" });

  const translate = useTranslate();

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
      case "phone_number":
        return phoneRegular;
      case "phone_login_number":
        return phone_login_Regular;
      case "address":
        return addressRegular;
      case "company":
        return companyNameRegular;
      case "inspection":
        return /^\d{10}$/;
      case "mersis":
        return /^\d{16}$/;
      case "article":
        return articleRegular;
      case "compound":
        return compoundRegular;
      case "season":
        return seasonRegular;
      case "brand":
        return brandRegular;
      case "pattern":
        return patternRegular;
      case "country":
        return countryRegular;
      case "name":
        return titleRegular;
      case "price":
        return priceRegular;
      case "size":
        return priceRegular;
      case "code":
        return codeRegular;
      case "weight":
        return weightRegular;
      case "description":
        return descriptionRegular;
      case "clothesSize":
        return clothesSizeRegular;
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
      case "inspection":
        return translate.inspectionCheck;
      case "mersis":
        return translate.mersisCheck;
      case "article":
        return translate.correctValue;
      case "compound":
        return translate.correctValue;
      case "season":
        return translate.correctValue;
      case "brand":
        return translate.correctValue;
      case "pattern":
        return translate.correctValue;
      case "country":
        return translate.correctValue;
      case "name":
        return translate.correctValue;
      case "price":
        return translate.checkPrice;
      case "size":
        return translate.checkSize;
      case "clothesSize":
        return translate.correctValue;
      case "code":
        return translate.checkCode;  
      case "weight":
        return translate.checkWeight;
      case "description":
        return translate.checkWeight;
    }
  };

  const returnInputProperties = (inputType: keyof IInputsLength) => {
    const maxLengthInput: IInputsLength = {
      email: 150,
      first_name: 150,
      last_name: 150,
      password: 120,
      phone_number: 18,
      phone_login_number: 18,
      address: 150,
      company: 30,
      inspection: 10,
      mersis: 16,
      season: 24,
      compound: 24,
      article: 24,
      brand: 24,
      pattern: 24,
      country: 24,
      name: 150,
      price: 13,
      size:3,
      code:6,
      weight:6,     
      description: 160, 
      clothesSize:5
    };

    const minLengthInput: IInputsLength = {
      email: 5,
      first_name: 2,
      last_name: 2,
      password: 8,
      phone_number: 12,
      phone_login_number: 8,
      address: 1,
      company: 1,
      inspection: 10,
      mersis: 16,
      season: 1,
      compound: 3,
      article: 3,
      brand: 3,
      pattern: 0,
      country: 11, 
      name: 3,    
      price: 1,  
      size:1,
      code:6 ,
      weight:1,
      description:10,
      clothesSize:1
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
