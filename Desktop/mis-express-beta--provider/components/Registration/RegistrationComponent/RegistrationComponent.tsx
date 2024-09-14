"use client";
//Global
import React, { useState } from "react";
//Components
import { Select, SelectItem, Input, Button } from "@nextui-org/react";
import InputMask from "react-input-mask";
//Hooks
import { useCustomForm } from "@/hooks/useCustomForm.";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useUserActions } from "@/hooks/useUserActions";
import { useTranslate } from "@/hooks/useTranslate";
//Types
import { IInputsRegistrationProvider } from "@/types/additionalTypes";
import { Country } from "@/types/componentsTypes";
//Styles
import "./RegistrationComponent.scss";
//Prefixes
import * as prefixes from '@/locales/prefixes.json';
import { setCookie } from "cookies-next";

export default function Provider({nextStep}: {nextStep: () => void}) {

  //hooks
  const { providerState} = useTypedSelector(state => state.user);
  const { onRegistrationUser, onGetUser } = useUserActions();
  const { isValid,returnInputError,returnInputProperties,handleSubmit,getValues,reset,setValue } = useCustomForm<IInputsRegistrationProvider>();
  const text = useTranslate();

  const [selected, setSelected] = useState<string>("");
  const [selectPhone, setSelectPhone] = useState<string>("+7");

  const Countries = [
    {
        name:text.Russia,
        value:'russia'
    },
    {
        name:text.China,
        value:'china',
    },
    {
        name:text.Turkey,
        value:'turkey',
    },
  ];

  const companyHeader = providerState?.state !== "C" ? "Данные компаниии" : "Заявка не принята";

  const selectClassName = {
    innerWrapper: "w-fit h-[50px]",
    popoverContent: "w-[130px] h-[250px]",
    mainWrapper: "w-[74px] h-[50px]",
    base: "w-[74px] h-[50px]",
    trigger: "border-tiffani rounded-md rounded-r-none shadow-none w-[74px] h-[50px] border-1 border-r-0",
  };


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
      email
    } = getValues();

    if (isValid && selected)
    onRegistrationUser(
      {
        user: {
          first_name,
          last_name,
          password,
          email,
          phone_number:(selectPhone + phone_number).replace(/[^\d+]/g, ''),
        },
        address,
        bank_account_number: { number: inspection.toString() },
        company,
        state: "M",
        country: selected,
        taxpayer_identification_number: mersis.toString(),
      }
    )
    .then(data => {
      if ("error" in data && data?.error?.message === "Rejected")
      console.error("регистрация не вышла");
    })
    .then(()=> setCookie("userPhone",(selectPhone + phone_number).replace(/[^\d+]/g, '')))
    .then(() => nextStep())
    .catch(error => console.log(error))
    .finally(() => {
      reset();
      setValue("phone_number", "");
    });
  };

  const returnAcceptedBlock = () => {

    if (providerState?.state !== "C"){ 
      return (
        <Button className="submit-form" type="submit">
          {text.cartContinue}
        </Button>
      );
    }
    
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
              {text.cartContinue}
            </Button>
          </div>
        </div>
      );
    };

  const renderAllCountries = () => (
    Countries.map(({name,value}) => (
      <SelectItem key={value} value={value}>
        {name}
      </SelectItem>
    ))
  );

  const renderAllPrefixes = () => {
    if (!prefixes.prefixes) return (
      <SelectItem key="+1" value="+1">
        Ошибка
      </SelectItem>
    );
  
    return (
      prefixes.prefixes?.map((country: Country) => (
        <SelectItem aria-label={`${country?.code}`} key={country?.code} value={`${country?.code}`}>
          <img src={country?.flag} alt={country?.name} className="inline-block w-4 h-4 mr-2" />
          {country?.code}
        </SelectItem>
      ))
    );
  };

  
  return (
    <div className="first-stage_wrapper">
      <div className="first-stage_content">
        <div className="first-stage_header">

          <h3 className="first-stage_title">
            {text.registrationTitle}
          </h3>

          <div className="provider-stages">

            <nav className="provider-stages-block">
              <div className="stage-link active"></div>
              <div className="stage-link active"></div>
              <div className="stage-link"></div>
              <div className="stage-link"></div>
            </nav>

            <p className="provider-stages-text">{text.registrationStage} 2/4</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleSubmitForm)} className="provider-form">

          <div className="provider-form-fields">
            <div className="provider-form-left">

              <label htmlFor="#" className="form-label">
                {text.registrationCountry}
                <Select
                  isRequired
                  disallowEmptySelection
                  classNames={{ trigger: "provider-form-input" }}
                  label={text.registartionCountryLabel}
                  selectedKeys={[selected]}
                  onChange={e => setSelected(e.target.value)}
                >
                  {renderAllCountries()}
                </Select>

                <p className="label-county-text">{text.registrationCountryText}</p>
              </label>

              <label htmlFor="#" className="form-label">
                {text.registrationPhoneNumber}
              <div className="flex">
              <Select
                aria-label="Страны и коды"
                onChange={(event) => setSelectPhone(event.target.value)}
                defaultSelectedKeys={[selectPhone]}
                disallowEmptySelection
                className="max-w-xs"
                classNames={selectClassName}
              >
                {renderAllPrefixes()}
              </Select>

                <InputMask
                    {...returnInputProperties("phone_number")}
                    className="provider-form-input phone"
                    alwaysShowMask
                    mask="(999) 999-99-99"
                  />
              </div>
              {returnInputError("phone_number")}
              </label>

              <label htmlFor="#" className="form-label">
                {text.registrationMersis}
                <Input
                  {...returnInputProperties("mersis")}
                  classNames={{ inputWrapper: "provider-form-input" }}
                  placeholder={text.registrationMersisLabel}
                  minLength={16}
                  maxLength={16}
                />
                {returnInputError("mersis")}
              </label>

              <label htmlFor="#" className="form-label">
                {text.registrationInspection}
                <Input
                  {...returnInputProperties("inspection")}
                  classNames={{ inputWrapper: "provider-form-input" }}
                  placeholder={text.registrationInspectionLabel}
                  minLength={10}
                  maxLength={10}
                />
                {returnInputError("inspection")}
              </label>

              <label htmlFor="#" className="form-label">
                {text.inputEmail}
                <Input
                  {...returnInputProperties("email")}
                  classNames={{ inputWrapper: "provider-form-input" }}
                  placeholder={text.inputEmailPlaceHolder}
                />
                {returnInputError("email")}
              </label>
            </div>

            <div className="provider-form-right">
              <label htmlFor="#" className="form-label">
                {text.logInLabelPassword}
                <Input
                  {...returnInputProperties("password")}
                  classNames={{ inputWrapper: "provider-form-input" }}
                  type="password"
                  placeholder={text.logInInputPassword}
                />
                {returnInputError("password")}
              </label>

              <label htmlFor="#" className="form-label">
                {text.registrationCompany}
                <Input
                  {...returnInputProperties("company")}
                  classNames={{ inputWrapper: "provider-form-input" }}
                  placeholder={text.registrationCompanyLabel}
                />
                {returnInputError("company")}
              </label>

              <label htmlFor="#" className="form-label">
                {text.registrationName}
                <Input
                  {...returnInputProperties("first_name")}
                  classNames={{ inputWrapper: "provider-form-input" }}
                  placeholder={text.registrationNameLabel}
                />
                {returnInputError("first_name")}
              </label>

              <label htmlFor="#" className="form-label">
                {text.registrationSurname}
                <Input
                  {...returnInputProperties("last_name")}
                  classNames={{ inputWrapper: "provider-form-input" }}
                  placeholder={text.registrationSurnameLabel}
                />
                {returnInputError("last_name")}
              </label>

              <label htmlFor="#" className="form-label">
                {text.registrationAddress}
                <Input
                  {...returnInputProperties("address")}
                  classNames={{ inputWrapper: "provider-form-input" }}
                  placeholder={text.registrationAddressLabel}
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
