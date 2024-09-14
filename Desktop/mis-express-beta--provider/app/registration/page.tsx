'use client';
//Global
import React, { lazy, Suspense,useEffect } from 'react';
//Components
const Registration = lazy(() => import('@/components/Registration/RegistrationComponent/RegistrationComponent'));
const Offer = lazy(() => import('@/components/Registration/OfferStage/OfferStage'));
const Timer = lazy(() => import('@/components/Registration/TimerComponent/TimerComponent'));
const PhoneConfirm = lazy(() => import('@/components/Registration/PhoneConfirmation/PhoneConfirmation'));

import { Icons } from '@/components/Icons/Icons';
//Hooks
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { useUserActions } from '@/hooks/useUserActions';


const RegistrationPage = () => {
  const { status, isProviderAuth,registrationPageNumber } = useTypedSelector(state => state.user);
  const { onGetUser,onSetRegistrationPage } = useUserActions();

  const nextStep = () => onSetRegistrationPage(registrationPageNumber + 1);

  const renderCurrentStep = () => {
    switch (registrationPageNumber) {
      case 1:
        return <Offer nextStep={nextStep} key="offer" />;
      case 2:
        return <Registration nextStep={nextStep}  key="registration"/>;
      case 3:
        return <PhoneConfirm nextStep={nextStep} />;
      case 4:
        return <Timer key="timer" />;
      default:
        return <Offer nextStep={nextStep} key="offer" />;
    }
  }
  //checkAuth
  useEffect(() => {
    onGetUser();
  }, [onGetUser]);

  useEffect(() => {
    if (isProviderAuth && status === "fulfilled" && registrationPageNumber !== 4) {
      onSetRegistrationPage(4); 
    }
  }, [isProviderAuth, registrationPageNumber]);

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