"use client";
//Global
import { showToastMessage } from "@/app/toastsChange";
import { FC ,useState} from "react";
//Components
import InputMask from "react-input-mask";
import { Icons } from "../../Icons/Icons";
import { Button, Input, Select, SelectItem  } from "@nextui-org/react";
//Types
import { IChangeUserData, IInputsChangeProfile } from "@/types/types";
import { IModalChangeProps, Country } from "@/types/componentTypes";
//Hooks
import { useTranslate } from "@/hooks/useTranslate";
import { useCustomForm } from "@/hooks/useCustomForm.";
import { useUserActions } from "@/hooks/useUserActions";
//Prefixes
import prefixes from "@/locales/prefixes.json";
//Styles
import "./ModalChange.scss";
import "@/app/registration/registration.scss";

const ModalChange: FC<IModalChangeProps> = ({ isChange, setIsChange }) => {

  const [selectPhone,setSelectPhone] = useState<string>('');
  const [prefixCode,setPrefixCode] = useState<string>('');

  //Hooks
  const translate = useTranslate();
  const { onChangeUserData } = useUserActions();
  const { getValues, handleSubmit, reset, setValue, isValid, returnInputError, returnInputProperties } = useCustomForm<IInputsChangeProfile>();

  //ClassNames
  const formClassName = !isChange ? "change-content" : "change-content active";
  const wrapperClassName = !isChange ? "change-wrapper" : "change-wrapper active";
  const selectClassName = {
    innerWrapper: "w-fit h-[30px]",
    popoverContent: "w-[130px] h-[250px]",
    mainWrapper: "w-[74px] h-[50px]",
    base: "w-[74px] h-[44px]",
    trigger: "rounded-tl-[10px] rounded-bl-[10px] rounded-tr-none rounded-br-none shadow-none w-[74px] h-[44px] border border-r-0"
  };
  //CallBack functions
  const stopPropagation = (event: React.MouseEvent | React.FormEvent) => event.stopPropagation();
  const setChange = () => setIsChange(false);

  const handleChangeUserData = () => {
    const { address, company, first_name, last_name, phone_number, email } = getValues();

    const requestBody: IChangeUserData = {
      user: {
        first_name,
        last_name,
        email,
      },
      address,
      company,
      phone_number: (prefixCode + phone_number).replace(/[^\d+]/g, ''),
    };

    if (!isValid) {
      showToastMessage("warn", translate.messageModalChangeWarn);
      return;
    }

    onChangeUserData(requestBody, reset, setValue, setIsChange);
  };
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
    <div onClick={setChange} className={wrapperClassName}>
      <form className={formClassName} onClick={stopPropagation} onSubmit={handleSubmit(handleChangeUserData)}>
        <h3 className="change-content-title">{translate.profileModalTitle}</h3>

        <label className="w-full" htmlFor="#">
          <Input
            {...returnInputProperties("first_name")}
            placeholder={`${translate.profileModalName}...`}
            name="first_name"
            classNames={{ inputWrapper: "change-content-input" }}
            type="text"
          />
          {returnInputError("first_name")}
        </label>

        <label className="w-full" htmlFor="#">
          <Input
            {...returnInputProperties("last_name")}
            placeholder={`${translate.profileModalSurName}...`}
            name="last_name"
            classNames={{ inputWrapper: "change-content-input" }}
            type="text"
          />
          {returnInputError("last_name")}
        </label>

        <label className="w-full" htmlFor="#">
          <Input
            {...returnInputProperties("company")}
            placeholder={`${translate.profileModalCompany}...`}
            name="company"
            classNames={{ inputWrapper: "change-content-input" }}
            type="text"
          />
          {returnInputError("company")}
        </label>

        <label className="w-full" htmlFor="#">
          <Input
            {...returnInputProperties("address")}
            placeholder={`${translate.profileModalAddress}...`}
            name="address"
            classNames={{ inputWrapper: "change-content-input" }}
            type="text"
          />
          {returnInputError("address")}
        </label>

        <label className="w-full" htmlFor="#">
          <Input
            {...returnInputProperties("email")}
            placeholder={`${translate.registrationLabelEmail}...`}
            name="email"
            classNames={{ inputWrapper: "change-content-input" }}
            type="text"
          />
          {returnInputError("email")}
        </label>

        <label className="w-full" htmlFor="#">

           <div className="flex">
            <Select
                radius="none"
                disallowEmptySelection
                defaultSelectedKeys={["+7"]}
                classNames={selectClassName}
                onChange={event => setPrefixCode(event.target.value)}
              >
                {renderAllPrefixes()}
              </Select>

              <InputMask
                {...returnInputProperties("phone_number")}
                data-phone
                className="form-content_bottom-label-input"
                mask='(999) 999-99-99'
                alwaysShowMask={true}
                onChange={event => setSelectPhone(event.target.value)}
              />
           </div>

          {returnInputError("phone_number")}
        </label>

        <Button type="submit" className="bg-tiffani text-white w-full">
          {translate.profileModalButton}
        </Button>

        <button
          onClick={setChange}
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
