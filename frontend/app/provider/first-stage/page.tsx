"use client";

//Global
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

//Components
import { Select, SelectItem, Input, Button } from "@nextui-org/react";
import InputMask from "react-input-mask";
import { Icons } from "@/components/Icons/Icons";

//Hooks
import { useCustomForm } from "@/hooks/useCustomForm.";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useUserActions } from "@/hooks/useUserActions";

//Utils
import {
  FIRST_STAGE_ROUTE,
  PROVIDER_ROUTE,
  SECOND_STAGE_ROUTE,
  THIRD_STAGE_ROUTE,
} from "@/utils/Consts";

//Types
import { IInputsRegistrationProvider } from "@/types/types";

//Styles
import "./first-stage.scss";

export default function Provider() {
  const { providerState, status } = useTypedSelector(state => state.user);

  const [selected, setSelected] = useState<string>("");

  const { onRegistrationUser, onGetUser } = useUserActions();

  const { push } = useRouter();

  const {
    isValid,
    returnInputError,
    returnInputProperties,
    handleSubmit,
    getValues,
    reset,
    setValue,
  } = useCustomForm<IInputsRegistrationProvider>();

  useEffect(() => {
    onGetUser();
  }, [onGetUser]);

  useEffect(() => {
    if (providerState && providerState.state === "F" && status === "fulfilled")
      push(PROVIDER_ROUTE);
  }, [providerState, status, push]);

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

    if (isValid && selected)
      onRegistrationUser(
        {
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
          state: "M",
          country: selected,
          phone_number,
          taxpayer_identification_number: mersis.toString(),
        },
        "provider"
      )
        .then(data => {
          if ("error" in data && data.error.message === "Rejected") {
            console.error("регистрация не вышла");
          } else {
            push(SECOND_STAGE_ROUTE);
          }
        })
        .catch(error => console.log(error))
        .finally(() => {
          reset();
          setValue("phone_number", "");
        });
  };

  const returnAcceptedBlock = () => {
    if (providerState?.state !== "C") {
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

  if (status === "pending" || providerState?.state === "F")
    return <Icons id="spiner" />;

  return (
    <div className="first-stage_wrapper">
      <div className="first-stage_content">
        <div className="first-stage_header">
          <h3 className="first-stage_title">
            {providerState?.state !== "C"
              ? "Данные компаниии"
              : "Заявка не принята"}
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
