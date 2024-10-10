'use client';
//Global
import { useEffect,useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { getCookie,deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { showToastMessage } from "@/app/toastsChange";
//Hooks
import { useCustomForm } from "@/hooks/useCustomForm.";
import { useTranslate } from "@/hooks/useTranslate";
import { useTypedSelector } from "@/hooks/useReduxHooks";
import { useUserActions } from "@/hooks/useUserActions";
//Services
import { postConfirmCode,resetUserPassword } from "@/services/authAPI";
//Types
import { IInputsRegistration } from "@/types/types";
//Utils
import { LOGIN_ROUTE, PROFILE_ROUTE } from "@/utils/Consts";
import { Icons } from "@/components/Icons/Icons";
//Styles
import './PhoneConfirmation.scss';

export default function PhoneConfirmation(){
  const [phoneNumber,setPhoneNumber] = useState('');
  const [isSenidng,setIsSending] = useState(false);
  const {push} = useRouter();
  const translate = useTranslate();
  const {onGetUser,onSetForgetPassword} = useUserActions();
  const { forgetPasswordState } = useTypedSelector(state => state.user);
  const {returnInputError,returnInputProperties,handleSubmit,getValues} = useCustomForm<IInputsRegistration>();

  const stopPropagation = (event: React.MouseEvent | React.FormEvent) => event.stopPropagation();

  const checkVerifyCode = async () => {
    setIsSending(true);

    if(forgetPasswordState){
      try {
        const response = await resetUserPassword({phone_number:phoneNumber,verification_code: getValues().code})
        
           if(response?.status === 200){
            showToastMessage('success', translate.phoneConfirmSuccess);
            deleteCookie('phoneNumber');
            deleteCookie('phonePrefix');
            push(LOGIN_ROUTE);
            onSetForgetPassword(false);
            return;
           };
           if(response?.response?.status){
            showToastMessage('error', translate.phoneConfirmError);
            return;
           };
       } catch (error) {
           showToastMessage('error',translate.phoneConfirmError)
           return;
       }finally{
          setIsSending(false);
       }
    }
    try {
      const response = await postConfirmCode(phoneNumber,getValues().code)
         if(response?.status === 200){
           onGetUser();
           push(PROFILE_ROUTE)
          return;
         };
         if(response?.response?.status){
          showToastMessage('error', translate.phoneConfirmError);
          return;
         }
     } catch (error) {
         console.error(error);
     }
     finally{
      setIsSending(false);
    }
  }
 
  const renderStages = () => {
    if(!forgetPasswordState) return(
      <div className="provider-stages">
        <nav className="provider-stages-block">
          <div className="stage-link active"></div>
          <div className="stage-link active"></div>
        </nav>

        <p className="provider-stages-text">{translate.registrationStage} 2/2</p>
      </div>
    )
  };

  useEffect(()=>{
    const phone = getCookie('phoneNumber');
    const phonePrefix = getCookie('phonePrefix');


    if(phone && phonePrefix) setPhoneNumber(phonePrefix + phone);


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
            disabled={isSenidng}
            type="submit"
            className="btnReg text-white rounded-md w-full h-[44px] py-[10px]"
          >
            {translate.ConfirmPhoneButton} {isSenidng && <Icons id="spiner-payment"/>}
          </Button>
        </div>
      </form>
    </main>
  
  )
};