'use client'
import React,{FC,useEffect,useState} from 'react'
import { Button, Select, SelectItem, } from "@nextui-org/react";
import InputMask from "react-input-mask";
import { useRouter } from 'next/navigation';
import { Icons } from '../../Icons/Icons';
import { setCookie } from 'cookies-next';
import { showToastMessage } from '@/app/toastsChange';
//types
import { IModalForgetPassword,Country } from '@/types/componentsTypes'
import { IInputsLogin } from '@/types/additionalTypes';
//utils
import { REGISTRATION_ROUTE } from '@/utils/Consts';
//hooks
import { useTranslate } from '@/hooks/useTranslate';
import { useUserActions } from '@/hooks/useUserActions';
import { useCustomForm } from '@/hooks/useCustomForm.';
//Services
import { getVerifySmsCode } from '@/services/codeConfirmation';
//Prefixes
import prefixes from '@/locales/prefixes.json';
//styles
import './ForgetPasswordModal.scss';



const ForgetPasswordModal:FC <IModalForgetPassword> = ({forgetModal,setForgetModal}) => {
 
  //ClassNames
  const wrapperClassName = !forgetModal ? "forget-wrapper" : "forget-wrapper active";
  const contentClassName = !forgetModal ? "forget-content" : "forget-content active";
  const selectClassName = {
    innerWrapper: "w-fit h-[30px]",
    popoverContent: "w-[130px] h-[250px]",
    mainWrapper: "w-[74px] h-[50px]",
    base: "w-[74px] h-[40px]",
    trigger: "rounded-tl-[10px] rounded-bl-[10px] rounded-tr-none rounded-br-none shadow-none w-[74px] h-[40px] border border-r-0"
  };
  //Hooks
  const {
    returnInputError,
    returnInputProperties,
    isValid,
    handleSubmit,
    getValues,
    reset,
    setValue
  } = useCustomForm<IInputsLogin>();
  const {push} = useRouter();
  const translate = useTranslate();
  const { onSetRegistrationPage,onSetForgetPassword } = useUserActions();

  const [selectPhone, setSelectPhone] = useState<string>("+7");


  
  const stopPropagation = (event: React.MouseEvent | React.FormEvent) => event.stopPropagation();

  const closeModal = () => setForgetModal(false);

  const sendRequestToRecoverPassword = async () => {
    if (!isValid) return;

    const phone = getValues().phone_number.replace(/[^\d+]/g, '');


    try {
      const resetPassword = await getVerifySmsCode(selectPhone + phone,'reset_password');
      
          if(resetPassword?.status === 200) {
            push(REGISTRATION_ROUTE);
            onSetRegistrationPage(3);
            onSetForgetPassword(true);
            setCookie('phoneNumber',phone);
            setCookie('phonePrefix',selectPhone);
            return;
          };
          if(resetPassword?.response?.status === 404){
            showToastMessage('warn',translate.notifyUserUndefiend);
            return;
          }
          if(resetPassword?.response?.status === 400){
            showToastMessage('warn',translate.notifyUserNorVerified);
            push(REGISTRATION_ROUTE);
            onSetRegistrationPage(3);
            setCookie('phoneNumber',phone);
            await getVerifySmsCode((selectPhone + phone).replace(/[^\d+]/g, ''),'verification');
            return;
          }
    } catch (error) {
      console.error(error)
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
  //колхоз. нужно обсуждать с матвеем
  useEffect(() => {
    if (forgetModal) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [forgetModal]);


  return (
    <main onClick={closeModal} className={wrapperClassName}>
      <form onSubmit={handleSubmit(sendRequestToRecoverPassword)} className={contentClassName} onClick={stopPropagation}>
        <h4 className="forget-content-title">{translate.recoverPasswordTitle}</h4>


          <label htmlFor="#" className="form-content-forget-label">
            <span className="form-content-forget-label-span">
              {translate.registrationPhoneNumber}
            </span>

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
                    className="form-content-forget-label-input phone"
                    alwaysShowMask
                    mask="(999) 999-99-99"
                  />
              </div>
              {returnInputError("phone_number")}
          </label>

          <Button
            type="submit"
            className="bg-black text-white rounded-md w-[100%] max-w-[300px] h-[44px] py-[10px]"
          >
            {translate.recoverAppeal}
          </Button>

        <button
          onClick={closeModal}
          className="close-forget-button"
        >
          <Icons id="deleteCard" />
        </button>
      </form>
    </main>
  )
}

export default ForgetPasswordModal