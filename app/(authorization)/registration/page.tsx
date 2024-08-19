'use client';
//Global
import React, { lazy, Suspense,useEffect,useState } from 'react';
//Components
const Registration = lazy(() => import('@/components/Registration/RegistrationComponent/RegistrationComponent'));
const PhoneConfirm = lazy(() => import('@/components/Registration/PhoneConfirmation/PhoneConfirmation'));
import { Icons } from '@/components/Icons/Icons';
//Hooks
import { useTypedSelector } from '@/hooks/useReduxHooks';
import { useUserActions } from '@/hooks/useUserActions';
import { useRouter } from 'next/navigation';
import { PROFILE_ROUTE } from '@/utils/Consts';


const RegistrationPage = () => {
  const {push} = useRouter();
  const { status, isAuth,registrationPageNumber } = useTypedSelector(state => state.user);
  const { onGetUser,onSetRegistrationPage } = useUserActions();



  const nextStep = () => onSetRegistrationPage(registrationPageNumber + 1);

  const renderCurrentStep = () => {
    switch (registrationPageNumber) {
      case 1:
        return <Registration nextStep={nextStep}  key="registration"/>;
      case 2:
        return <PhoneConfirm/>;
      default:
        return <Registration nextStep={nextStep}  key="registration"/>;
    }
  };

  //checkAuth
  useEffect(() => {
    onGetUser();
  }, [onGetUser]);

  useEffect(() => {
    if (isAuth && status === "fulfilled") {
      push(PROFILE_ROUTE)
    }
  }, [isAuth,status,push]);

  if (status === "pending") return(
      <div className="products-content_spiner">
        <Icons id="spiner" />
      </div>
  );


  return (
    <div>
      <Suspense fallback={<div className="products-content_spiner"><Icons id="spiner" /></div>}>
        {renderCurrentStep()}
      </Suspense>
    </div>
  );
};

export default RegistrationPage;