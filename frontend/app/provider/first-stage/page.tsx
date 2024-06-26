"use client";

//Global
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

//Components
import { Select, SelectItem, Input, Button } from "@nextui-org/react";
import InputMask from "react-input-mask";

//Hooks
import { useCustomForm } from "@/hooks/useCustomForm.";
import { useProviderActions } from "@/hooks/useProviderActions";

//Utils
import {
  FIRST_STAGE_ROUTE,
  SECOND_STAGE_ROUTE,
  THIRD_STAGE_ROUTE,
} from "@/utils/Consts";

//Types
import {
  IInputsRegistrationProvider,
  IPostRegistrationProvider,
} from "@/types/types";

//Styles
import "./first-stage.scss";

export default function Provider() {
  const [isAccept, setIsAccept] = useState<boolean>(true),
    [selected, setSelected] = useState<string>("");

  const { onRegistrationProvider } = useProviderActions();

  const {
    isValid,
    returnInputError,
    returnInputProperties,
    handleSubmit,
    getValues,
    reset,
    setValue,
  } = useCustomForm<IInputsRegistrationProvider>();

  const handleSubmitForm = () => {
    const {
      address,
      company,
      first_name,
      inspection,
      last_name,
      mersis,
      password,
      phone_number,
      username,
    } = getValues();

    const body: IPostRegistrationProvider = {
      user: {
        first_name,
        last_name,
        password,
        username,
        is_provider: true,
      },
      address,
      bank_account_number: { number: inspection.toString() },
      company,
      state: "1s",
      country: selected,
      phone_number,
      taxpayer_identification_number: mersis,
    };

    if (isValid && selected)
      onRegistrationProvider(body)
        .then(data => {
          console.log(data);
          console.log(body);
        })
        .catch(error => console.log(error))
        .finally(() => {
          reset();
          setValue("phone_number", "");
        });
  };

  const returnAcceptedBlock = () => {
    if (isAccept) {
      return (
        <Button className="submit-form" type="submit">
          Продолжить
        </Button>
      );
    } else {
      return (
        <div className="comment-wrapper">
          <h5 className="comment-title">Комментарий к заявке</h5>

          <div className="comment-content">
            <div className="comment-content_block">
              <p>
                Номер банковского счёта введён некорректно. Просьба проверить
                правильность введённых данных и направить заявку на повторную
                модерацию.
              </p>
            </div>

            <Button className="submit-form" type="submit">
              Продолжить
            </Button>
          </div>
        </div>
      );
    }
  };

  const countries = [
    "Турция",
    "Россия",
    "Китай",
    "Англия",
    "Испания",
    "Израиль",
    "Япония",
    "Корея",
    "Португалия",
  ];

  return (
    <div className="first-stage_wrapper">
      <div className="first-stage_content">
        <div className="first-stage_header">
          <h3 className="first-stage_title">
            {isAccept ? "Данные компаниии" : "Заявка не принята"}
          </h3>

          <div className="provider-stages">
            <nav className="provider-stages-block">
              <Link href={FIRST_STAGE_ROUTE} className="stage-link active" />
              <Link href={SECOND_STAGE_ROUTE} className="stage-link" />
              <Link href={THIRD_STAGE_ROUTE} className="stage-link" />
            </nav>

            <p className="provider-stages-text">Регистрация. Этап 1/3</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="provider-form"
        >
          <div className="provider-form-fields">
            <div className="provider-form-left">
              <label htmlFor="#" className="form-label">
                Страна регистрации
                <Select
                  isRequired
                  disallowEmptySelection
                  classNames={{ trigger: "provider-form-input" }}
                  label="Выберите страну из списка"
                  selectedKeys={[selected]}
                  onChange={e => setSelected(e.target.value)}
                >
                  {countries.map(county => (
                    <SelectItem key={county} value={county}>
                      {county}
                    </SelectItem>
                  ))}
                </Select>
                <p className="label-county-text">Выберите из списка</p>
              </label>

              <label htmlFor="#" className="form-label">
                Номер телефона
                <InputMask
                  {...returnInputProperties("phone_number")}
                  className="provider-form-input"
                  alwaysShowMask
                  mask="+7 (999) 999-99-99"
                />
                {returnInputError("phone_number")}
              </label>

              <label htmlFor="#" className="form-label">
                Номер Mersis
                <Input
                  {...returnInputProperties("mersis")}
                  classNames={{ inputWrapper: "provider-form-input" }}
                  placeholder="Ваш номер Mersis..."
                />
                {returnInputError("mersis")}
              </label>

              <label htmlFor="#" className="form-label">
                Налоговая инспекция и номер
                <Input
                  {...returnInputProperties("inspection")}
                  classNames={{ inputWrapper: "provider-form-input" }}
                  placeholder="Номер..."
                />
                {returnInputError("inspection")}
              </label>

              <label htmlFor="#" className="form-label">
                Логин
                <Input
                  {...returnInputProperties("username")}
                  classNames={{ inputWrapper: "provider-form-input" }}
                  placeholder="Логин..."
                />
                {returnInputError("username")}
              </label>
            </div>

            <div className="provider-form-right">
              <label htmlFor="#" className="form-label">
                Пароль
                <Input
                  {...returnInputProperties("password")}
                  classNames={{ inputWrapper: "provider-form-input" }}
                  type="password"
                  placeholder="Пароль..."
                />
                {returnInputError("password")}
              </label>

              <label htmlFor="#" className="form-label">
                Название фирмы
                <Input
                  {...returnInputProperties("company")}
                  classNames={{ inputWrapper: "provider-form-input" }}
                  placeholder="Название вашей фирмы..."
                />
                {returnInputError("company")}
              </label>

              <label htmlFor="#" className="form-label">
                Имя
                <Input
                  {...returnInputProperties("first_name")}
                  classNames={{ inputWrapper: "provider-form-input" }}
                  placeholder="Ваше имя..."
                />
                {returnInputError("first_name")}
              </label>

              <label htmlFor="#" className="form-label">
                Фамилия
                <Input
                  {...returnInputProperties("last_name")}
                  classNames={{ inputWrapper: "provider-form-input" }}
                  placeholder="Ваша фамилия..."
                />
                {returnInputError("last_name")}
              </label>

              <label htmlFor="#" className="form-label">
                Адрес
                <Input
                  {...returnInputProperties("address")}
                  classNames={{ inputWrapper: "provider-form-input" }}
                  placeholder="Ваш адрес..."
                />
                {returnInputError("address")}
              </label>
            </div>
          </div>

          {returnAcceptedBlock()}
        </form>
      </div>
    </div>
  );
}
