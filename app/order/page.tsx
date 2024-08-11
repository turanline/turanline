'use client';
//Global
import React, { lazy, Suspense,useEffect } from 'react';
//Components
const ConfirmOrder = lazy(() => import('@/components/Order/ConfirmOrder/ConfirmOrder'));
const PaymentOrder = lazy(() => import('@/components/Order/PaymentOrder/PaymentOrder'));
import { Icons } from '@/components/Icons/Icons';
//Hooks
import { useTypedSelector } from '@/hooks/useReduxHooks';
import { useUserActions } from '@/hooks/useUserActions';


const OrderPage = () => {
  const { status,isAuth,paymentPageNumber } = useTypedSelector(state => state.user);
  const { onGetUser,onSetPaymenPageNumber } = useUserActions();

  const nextStep = () => onSetPaymenPageNumber(paymentPageNumber + 1);
  const prevStep = () => onSetPaymenPageNumber(paymentPageNumber - 1);


  const renderCurrentStep = () => {
    switch (paymentPageNumber) {
      case 1:
        return <ConfirmOrder nextStep={nextStep} key="confirm" />;
      case 2:
        return <PaymentOrder prevStep={prevStep}  key="payment"/>;
      default:
        return <ConfirmOrder nextStep={nextStep} key="confirm" />;
    }
  }
  //checkAuth
  useEffect(() => {
    onGetUser();
  }, [onGetUser]);

  // useEffect(() => {
  //   if (isAuth && status === "fulfilled" && paymentPageNumber !== 2) {
  //     onSetRegistrationPage(1); 
  //   }
  // }, [isProviderAuth, registrationPageNumber]);

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

export default OrderPage;