"use client";
//Global
import { showToastMessage } from "@/app/toastsChange";
import { useRouter } from "next/navigation";
import { FC ,useEffect,useState} from "react";
//Components
import InputMask from "react-input-mask";
import { Icons } from "../../Icons/Icons";
import { Button, Input, Select, SelectItem  } from "@nextui-org/react";
//Types
import { IChangeUserData, IInputsChangeProfile } from "@/types/types";
import { IModalChangeProps, Country } from "@/types/componentTypes";
//Cookies
import { setCookie ,getCookie} from "cookies-next";
//Hooks
import { useTranslate } from "@/hooks/useTranslate";
import { useCustomForm } from "@/hooks/useCustomForm.";
import { useUserActions } from "@/hooks/useUserActions";
import { useTypedSelector } from "@/hooks/useReduxHooks";
//Services
import { getVerifySmsCode } from "@/services/authAPI";
import { clearTokens, verifyAndRefreshToken } from "@/services";
import { changeUserData } from "@/services/usersAPI";
//Utils
import { REGISTRATION_ROUTE } from "@/utils/Consts";
//Prefixes
import prefixes from "@/locales/prefixes.json";
//Styles
import "./ModalChange.scss";



interface IuserData{
  first_name: string;
  last_name: string;
  company: string;
  address: string;
  email: string;
  phone_number: string;
  
}

const ModalChange: FC<IModalChangeProps> = ({ isChange, setIsChange }) => {

  const [prefixCode,setPrefixCode] = useState<string>('');
  const [newUserData,setNewUserData] = useState<IuserData>({
    first_name:"",last_name:"",company:"",address:"",email:"",phone_number:""
  });
  //Hooks
  const translate = useTranslate();
  const {onUpdateUserState,onSetRegistrationPage,onLogOutUser,onGetUser} = useUserActions();
  const { handleSubmit, isValid, setValue,reset,getValues, returnInputError, returnInputProperties } = useCustomForm<IInputsChangeProfile>();
  const { userState, status,isAuth} = useTypedSelector(state => state.user);
  const {push} = useRouter();


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

  const handleChangeUserData = async () => {
    try {
      if (!isValid) {
        showToastMessage("warn", translate.messageModalChangeWarn);
        return;
      }
  
      const { address, company, first_name, last_name, phone_number, email } = getValues();
  
      const requestBody: IChangeUserData = {
        user: {
          first_name,
          last_name,
          email,
          phone_number: (prefixCode + phone_number).replace(/[^\d+]/g, ''),
        },
        address,
        company,
      };
  
      // Отправка запроса на изменение данных
      const user = await verifyAndRefreshToken();
      const response = await changeUserData(user,requestBody);

      if(response.status === 200){
        showToastMessage("success", translate.messageModalChangeSuccess);
        await onUpdateUserState(requestBody)
        setIsChange(false);
      }
      if(response?.response.status === 406){
        await onLogOutUser();

        setCookie('phoneNumber', (phone_number).replace(/[^\d+]/g, ''));
        onSetRegistrationPage(2);
        getVerifySmsCode((prefixCode + phone_number).replace(/[^\d+]/g, ''), 'verification');
        showToastMessage("warn", "Пользователь не подтвержден");

        push(REGISTRATION_ROUTE);
        return;
      }
      if(response?.response.status === 400 || response?.response.status === 500 || response?.response.status === 429){
        showToastMessage("success", 'Ошибка при изменении данных');
        setIsChange(false);
      }

 
    } catch (error) {
      console.error(error);
    }
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
  const changeUserInformation = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewUserData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
 

  //За такое можно стрелять на поражение
  //Я просто понятия не имею что тут сделал Матвей что все поля будто циклом проверяет
  useEffect(() => {
    if (userState && status === 'fulfilled') {
      const { phone_number, first_name, last_name, email } = userState?.user;
      const phonePrefix = phone_number.slice(0, phone_number.length - 10);
      const phoneNumber = phone_number.slice(-10);
  
      // Обновляем состояние формы
      setNewUserData({
        first_name: first_name || '',
        last_name: last_name || '',
        company: userState?.company || '',
        address: userState?.address || '',
        email: email || '',
        phone_number: phoneNumber || ''
      });
  
      // Устанавливаем значения в форму
      reset({
        first_name: first_name || '',
        last_name: last_name || '',
        company: userState?.company || '',
        address: userState?.address || '',
        email: email || '',
        phone_number: phoneNumber || ''
      });
  
      // Устанавливаем префикс телефона
      setPrefixCode(phonePrefix);
    }
  }, [userState, status, reset, translate]);
  


  return (
    <div onClick={setChange} className={wrapperClassName}>
      <form className={formClassName} onClick={stopPropagation} onSubmit={handleSubmit(handleChangeUserData)}>
        <h3 className="change-content-title">{translate.profileModalTitle}</h3>

        <label className="w-full" htmlFor="#">
          <Input
            {...returnInputProperties("first_name")}
            placeholder={`${translate.profileModalName}...`}
            classNames={{ inputWrapper: "change-content-input" }}
            value={newUserData?.first_name}
            onChange={changeUserInformation}
          />
          {returnInputError("first_name")}
        </label>

        <label className="w-full" htmlFor="#">
          <Input
            {...returnInputProperties("last_name")}
            placeholder={`${translate.profileModalSurName}...`}
            classNames={{ inputWrapper: "change-content-input" }}
            type="text"
            value={newUserData?.last_name}
            onChange={changeUserInformation}
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
            value={newUserData?.company}
            onChange={changeUserInformation}
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
            value={newUserData?.address}
            onChange={changeUserInformation}
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
            value={newUserData?.email}
            onChange={changeUserInformation}
          />
          {returnInputError("email")}
        </label>

        <label className="w-full" htmlFor="#">

           <div className="flex">
            <Select
                aria-label="select-prefix"
                radius="none"
                disallowEmptySelection
                selectedKeys={new Set([prefixCode])} 
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
                value={newUserData?.phone_number}
                onChange={changeUserInformation}
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
