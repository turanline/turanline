"use client";
//Global
import React, { useState } from "react";
//Components
import { Select, SelectItem, Input, Button } from "@nextui-org/react";
import InputMask from "react-input-mask";
import { showToastMessage } from "@/app/toastsChange";
//Hooks
import { useCustomForm } from "@/hooks/useCustomForm.";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useUserActions } from "@/hooks/useUserActions";
import { useTranslate } from "@/hooks/useTranslate";
//Types
import { IInputsRegistrationProvider ,IPostRegistrationProvider} from "@/types/additionalTypes";
import { Country } from "@/types/componentsTypes";
//Prefixes
import * as prefixes from '@/locales/prefixes.json';
//Styles
import "./RegistrationComponent.scss";



export default function Provider({nextStep}: {nextStep: () => void}) {

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectPhoneRegistration, setSelectPhoneRegistration] = useState<string>("+7");

  //hooks
  const translate = useTranslate();
  const { providerState} = useTypedSelector(state => state.authorization);
  const { onRegistrationUser } = useUserActions();
  const { isValid,returnInputError,returnInputProperties,handleSubmit,getValues,reset,setValue } = useCustomForm<IInputsRegistrationProvider>();

  const Countries = [
    {
        name:translate.Russia,
        value:'russia'
    },
    {
        name:translate.China,
        value:'china',
    },
    {
        name:translate.Turkey,
        value:'turkey',
    },
  ];


  const selectClassName = {
    innerWrapper: "w-fit h-[50px]",
    popoverContent: "w-[130px] h-[250px]",
    mainWrapper: "w-[74px] h-[50px]",
    base: "w-[74px] h-[50px]",
    trigger: "border-tiffani rounded-md rounded-r-none shadow-none w-[74px] h-[50px] border-1 border-r-0",
  };


  const handleSubmitForm = async () => {
    try {
      if (!isValid && !selectedCountry){
        showToastMessage('warn', translate.notifyFillFields)
        return;
      }
      const { address, company, first_name, inspection, last_name, mersis, password, phone_number, email} = getValues();
      const requestBody: IPostRegistrationProvider = {
        user: {
          first_name,
          last_name,
          password,
          email,
          phone_number:(selectPhoneRegistration + phone_number).replace(/[^\d+]/g, ''),
        },
        address,
        bank_account_number: { number: inspection.toString() },
        company,
        state: "M",
        country: selectedCountry,
        taxpayer_identification_number: mersis.toString(),
      }

      const response = await onRegistrationUser(requestBody,{phone_number,selectPhoneRegistration,nextStep});
      
    } catch (error) {
        console.error(error)
    }
  };

  const returnAcceptedBlock = () => {

    if (providerState?.state !== "C"){ 
      return (
        <Button className="submit-form" type="submit">
          {translate.cartContinue}
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
              {translate.cartContinue}
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
            {translate.registrationTitle}
          </h3>

          <div className="provider-stages">

            <nav className="provider-stages-block">
              <div className="stage-link active"></div>
              <div className="stage-link active"></div>
              <div className="stage-link"></div>
              <div className="stage-link"></div>
            </nav>

            <p className="provider-stages-text">{translate.registrationStage} 2/4</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleSubmitForm)} className="provider-form">

          <div className="provider-form-fields">
            <div className="provider-form-left">

              <label htmlFor="#" className="form-label">
                {translate.registrationCountry}
                <Select
                  isRequired
                  disallowEmptySelection
                  classNames={{ trigger: "provider-form-input" }}
                  label={translate.registartionCountryLabel}
                  selectedKeys={[selectedCountry]}
                  onChange={e => setSelectedCountry(e.target.value)}
                >
                  {renderAllCountries()}
                </Select>

                <p className="label-county-text">{translate.registrationCountryText}</p>
              </label>

              <label htmlFor="#" className="form-label">
                {translate.registrationPhoneNumber}
              <div className="flex">
              <Select
                aria-label="Страны и коды"
                onChange={(event) => setSelectPhoneRegistration(event.target.value)}
                defaultSelectedKeys={[selectPhoneRegistration]}
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
                {translate.registrationMersis}
                <Input
                  {...returnInputProperties("mersis")}
                  classNames={{ inputWrapper: "provider-form-input" }}
                  placeholder={translate.registrationMersisLabel}
                  minLength={16}
                  maxLength={16}
                />
                {returnInputError("mersis")}
              </label>

              <label htmlFor="#" className="form-label">
                {translate.registrationInspection}
                <Input
                  {...returnInputProperties("inspection")}
                  classNames={{ inputWrapper: "provider-form-input" }}
                  placeholder={translate.registrationInspectionLabel}
                  minLength={10}
                  maxLength={10}
                />
                {returnInputError("inspection")}
              </label>

              <label htmlFor="#" className="form-label">
                {translate.inputEmail}
                <Input
                  {...returnInputProperties("email")}
                  classNames={{ inputWrapper: "provider-form-input" }}
                  placeholder={translate.inputEmailPlaceHolder}
                />
                {returnInputError("email")}
              </label>
            </div>

            <div className="provider-form-right">
              <label htmlFor="#" className="form-label">
                {translate.logInLabelPassword}
                <Input
                  {...returnInputProperties("password")}
                  classNames={{ inputWrapper: "provider-form-input" }}
                  type="password"
                  placeholder={translate.logInInputPassword}
                />
                {returnInputError("password")}
              </label>

              <label htmlFor="#" className="form-label">
                {translate.registrationCompany}
                <Input
                  {...returnInputProperties("company")}
                  classNames={{ inputWrapper: "provider-form-input" }}
                  placeholder={translate.registrationCompanyLabel}
                />
                {returnInputError("company")}
              </label>

              <label htmlFor="#" className="form-label">
                {translate.registrationName}
                <Input
                  {...returnInputProperties("first_name")}
                  classNames={{ inputWrapper: "provider-form-input" }}
                  placeholder={translate.registrationNameLabel}
                />
                {returnInputError("first_name")}
              </label>

              <label htmlFor="#" className="form-label">
                {translate.registrationSurname}
                <Input
                  {...returnInputProperties("last_name")}
                  classNames={{ inputWrapper: "provider-form-input" }}
                  placeholder={translate.registrationSurnameLabel}
                />
                {returnInputError("last_name")}
              </label>

              <label htmlFor="#" className="form-label">
                {translate.registrationAddress}
                <Input
                  {...returnInputProperties("address")}
                  classNames={{ inputWrapper: "provider-form-input" }}
                  placeholder={translate.registrationAddressLabel}
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
