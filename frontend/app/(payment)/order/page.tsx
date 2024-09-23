'use client';
//Global
import React, { lazy, Suspense,useEffect } from 'react';
//Components
const ConfirmOrder = lazy(() => import('@/components/Order/ConfirmOrder/ConfirmOrder'));
const PaymentOrder = lazy(() => import('@/components/Order/PaymentOrder/PaymentOrder'));
import { Icons } from '@/components/Icons/Icons';
import { useRouter } from 'next/navigation';
//Hooks
import { useTypedSelector } from '@/hooks/useReduxHooks';
import { useUserActions } from '@/hooks/useUserActions';
import { useCart } from '@/hooks/useCart';
//Utils
import { LOGIN_ROUTE, SHOP_ROUTE } from '@/utils/Consts';
import { showToastMessage } from '@/app/toastsChange';


const OrderPage = () => {
  const {push} = useRouter();

  const { status,isAuth,paymentPageNumber } = useTypedSelector(state => state.user);
  const { cart } = useTypedSelector(state => state.cart);

  const { onGetUser,onSetPaymenPageNumber } = useUserActions();
  const {onFetchCart} = useCart();

  const nextStep = () => onSetPaymenPageNumber(paymentPageNumber + 1);
  const prevStep = () => onSetPaymenPageNumber(paymentPageNumber - 1);


  const renderCurrentStep = () => {
    switch (paymentPageNumber) {
      case 2:
        return <ConfirmOrder nextStep={nextStep} key="confirm" />;
      case 1:
        return <PaymentOrder prevStep={prevStep}  key="payment"/>;
      default:
        return <ConfirmOrder nextStep={nextStep} key="confirm" />;
    }
  }
  //checkAuth
  useEffect(() => {
    onGetUser();
  }, [onGetUser]);

  useEffect(()=>{
    onFetchCart();
  },[onFetchCart])

  useEffect(()=>{
    if (!cart?.order_products?.length) {
      push(SHOP_ROUTE);
      onSetPaymenPageNumber(1); 
    }
  },[cart])

  useEffect(() => {
    if (!isAuth && status === "fulfilled") {
      push(LOGIN_ROUTE);
      onSetPaymenPageNumber(1); 
    }
  }, [isAuth, status]);

  if (status === "pending") return(
      <div className="products-content_spiner">
        <Icons id="spiner" />
      </div>
  );


  return (
    <Suspense fallback={<div className="products-content_spiner"><Icons id="spiner" /></div>}>
      {renderCurrentStep()}
    </Suspense>
  );
};

export default OrderPage;