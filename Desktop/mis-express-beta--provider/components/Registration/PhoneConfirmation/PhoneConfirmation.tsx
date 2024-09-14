'use client';
//Global
import { useEffect,useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { getCookie,deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
//Hooks
import { useCustomForm } from "@/hooks/useCustomForm.";
import { useTranslate } from "@/hooks/useTranslate";
import { useUserActions } from "@/hooks/useUserActions";
import { useTypedSelector } from "@/hooks/useTypedSelector";
//Utils
import { LOGIN_ROUTE } from "@/utils/Consts";
//Services
import { postVerifySmsCode } from "@/services/authAPI";
//Types
import { IInputsRegistrationProvider } from "@/types/additionalTypes";
//Styles
import './PhoneConfirmation.scss';
import { showToastMessage } from "@/app/toastsChange";

export default function PhoneConfirmation({nextStep}: {nextStep: () => void}){
  const { push } = useRouter();
  const translate = useTranslate();
  const {onGetUser,onSetForgetPassword} = useUserActions();
  const { forgetPasswordState } = useTypedSelector(state => state.user);
  const {returnInputError,returnInputProperties,handleSubmit,getValues} = useCustomForm<IInputsRegistrationProvider>();

  const [phoneNumber,setPhoneNumber] = useState('');


  const renderStages = () => {
    if(!forgetPasswordState) return(
      <div className="provider-stages">
        <nav className="provider-stages-block">
          <div className="stage-link active"></div>
          <div className="stage-link active"></div>
          <div className="stage-link active"></div>
          <div className="stage-link"></div>
        </nav>

        <p className="provider-stages-text">{translate.registrationStage} 3/4</p>
      </div>
    )
  };
  const stopPropagation = (event: React.MouseEvent | React.FormEvent) => event.stopPropagation();

  const checkVerifyCode = () => {
    try {
      postVerifySmsCode(phoneNumber,getValues().code)
      .then(response => {
        if(response){
          if(forgetPasswordState){
            showToastMessage('success','Проверка прошла успешно');
            deleteCookie('userPhone');
            push(LOGIN_ROUTE);
            onSetForgetPassword(false);
          };
          onGetUser();
          nextStep();
        };
        if(!response) showToastMessage('error','Проверка не прошла');
      })
      .catch(error => console.error(error))
    } catch (error) {
        showToastMessage('error','Проверка не прошла')
    }
  }

  useEffect(()=>{
    const phone = getCookie('userPhone');

    if(phone) setPhoneNumber(phone);

  },[phoneNumber])


  return (
    <main className="form-wrapper-phone">
       <div className="provider-stages-wrapper">
          {renderStages()}
       </div>


      <form onSubmit={handleSubmit(checkVerifyCode)} className="form-content-phone" onClick={stopPropagation}>
     
        <div className="form-content_header-phone">
          <h5 className="form-content_header-title-phone">{translate.phoneConfirmTitle}</h5>
        </div>

        

        <div className="form-content_phone">
          <label htmlFor="#" className="form-content_phone-label">
            <div className="confirm-code-text">
              <span className="form-content_phone-label-span">
                {translate.PhoneConfirmText1}
              </span>
              <span className="form-content_phone-label-span phone">
                {phoneNumber}
              </span>
              <span className="form-content_phone-label-span">
                {translate.PhoneConfirmText2}
              </span>
            </div>
          </label>

          <label htmlFor="#" className="form-content_phone-label">
            <span className="form-content_phone-label-span">
              {translate.PhoneConfirmCode}
            </span>

            <Input
              {...returnInputProperties("code")}
              placeholder={translate.PhoneConfirmCodePlaceHolder}
              classNames={{ inputWrapper: "form-content_phone-label-input" }}
              maxLength={6}
              minLength={6}
            />
            {returnInputError("code")}
          </label>

          <Button
            type="submit"
            className="bg-tiffani text-white rounded-md w-full h-[44px] py-[10px]"
          >
            {translate.ConfirmPhoneButton}
          </Button>
        </div>
      </form>
    </main>
  
  )
};