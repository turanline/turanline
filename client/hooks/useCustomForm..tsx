"use client";

//React-Hook-Form
import { FieldValues, useForm } from "react-hook-form";

//Types
import { IInputsLength } from "@/types/types";

//Utils
import {
  emailRegular,
  passwordRegular,
  nameRegular,
  surnameRegular,
  usernameRegular,
} from "@/utils/Consts";

const useCustomForm = () => {
  const {
    register,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

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
    }
  };

  const returnMessageByInputType = (inputType: keyof IInputsLength) => {
    switch (inputType) {
      case "email":
        return "Пожалуйста, введите корректный адрес электронной почты.";
      case "first_name":
        return "Пожалуйста, введите корректное значение, начинающееся с заглавной буквы Английского алфавита, за которой могут следовать только строчные буквы.";
      case "last_name":
        return "Пожалуйста, введите корректное значение, начинающееся с заглавной буквы Английского алфавита, за которой могут следовать только строчные буквы.";
      case "password":
        return "Пароль может содержать только буквы (верхнего и нижнего регистра) и цифры. Пожалуйста, убедитесь, что ваш пароль соответствует этим требованиям.";
      case "username":
        return "Логин может содержать только буквы (верхнего и нижнего регистра), цифры и нижние подчеркивания. Пожалуйста, убедитесь, что ваш логин состоит только из указанных символов.";
    }
  };

  const returnInputProperties = (inputType: keyof IInputsLength) => {
    const maxLengthInput: IInputsLength = {
      email: 150,
      first_name: 150,
      last_name: 150,
      password: 120,
      username: 150,
    };

    const minLengthInput: IInputsLength = {
      email: 5,
      first_name: 2,
      last_name: 2,
      password: 8,
      username: 3,
    };

    return {
      ...register(inputType, {
        required: "Это поле обязательно!",
        minLength: {
          value: minLengthInput[inputType],
          message: `Не менее ${minLengthInput[inputType]} символов`,
        },
        maxLength: {
          value: maxLengthInput[inputType],
          message: `Не более ${maxLengthInput[inputType]} символов`,
        },
        pattern: {
          value: returnRegularByInputType(inputType),
          message: returnMessageByInputType(inputType),
        },
      }),
    };
  };

  const returnInputError = (inputType: keyof IInputsLength) => (
    <span style={{ textAlign: "left", color: "red" }}>
      {errors[inputType]?.message?.toString()}
    </span>
  );

  return {
    returnInputError,
    returnInputProperties,
  };
};

export { useCustomForm };
