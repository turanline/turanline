"use client";
//Global
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { showToastMessage } from "@/app/toastsChange";
import ReactInputMask from "react-input-mask";
import { postToPay } from "@/services/paymentAPI";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
//Components
import {
  Button,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Icons } from "@/components/Icons/Icons";
//Hooks
import { useTranslate } from "@/hooks/useTranslate";
import { useTypedSelector } from "@/hooks/useReduxHooks";
import { useCart } from "@/hooks/useCart";
import { useCustomForm } from "@/hooks/useCustomForm.";
//Utils
import {
  POLITIC_ROUTE,
  SHOP_ROUTE,
  BASKET_ROUTE
} from "@/utils/Consts";
import { cardsArray } from "@/utils/Arrays";
//Types
import { IInputsCard } from "@/types/types";
//Styles
import "./PaymentOrder.scss";



export default function PaymentOrder({prevStep}: {prevStep: () => void}) {
  const { push } = useRouter();
  const translate = useTranslate();
  const { status: cartStatus } = useTypedSelector(state => state.cart);
  const { isAuth,status: userStatus } = useTypedSelector(state => state.user);
  const { returnAllProductsCounter, calculateTotalPrice } = useCart();
  const { returnInputError,returnInputProperties,isValid,getValues,handleSubmit,reset,setValue } = useCustomForm<IInputsCard>();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryCost = localStorage.getItem('deliveryCost');


  //Handle
  const handlePostPaymentOrder = async () => {
    if(!isValid){
      showToastMessage("warn",'Заполните все поля');
      return;
    };
    setIsSubmitting(true);

    try {
      const requestBody = {
          card_number: String(getValues()?.card_number).replace(/-/g, ''),
          expiration_year: getValues()?.expiration_year,
          expiration_month: getValues()?.expiration_month,
          cardholder_name: getValues()?.cardholder_name,
          comment: "test",
      };
      const response = await postToPay(requestBody);
    
      if (response?.status === 200 && typeof response.data === 'string' && response.data.includes("<html")) {     
        document.open();
        document.write(response?.data);
        document.close();
        return;
      };
      if(response?.response?.status === 401){
        showToastMessage("error",'Пользователь не авторизован');
        return;
      };
      if(response?.response?.status === 400){
        showToastMessage("error",'Неверные данные');
        return;
      };
      if(response?.response?.status === 404){
        showToastMessage("error",'Заказ не найден');
        return;
      };
      if(response?.response?.status === 500){
        showToastMessage("error",'Ошибка в заказах');
        return;
      };
    } catch (error) {
      console.error(error);
    }
    finally{
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isAuth && userStatus === "fulfilled") push(SHOP_ROUTE);
  }, [isAuth, userStatus, push]);

  if (!isAuth || userStatus === "pending" || cartStatus === "pending")
    return <Icons id="spiner" />;

  return (
    <main className="container mx-auto mt-[30px] mb-[100px] px-[28px] sm:px-0">
      <div className="w-full flex flex-col gap-[30px]">
      <Breadcrumbs>
        <BreadcrumbItem href={SHOP_ROUTE}>{translate.mainPageRoute}</BreadcrumbItem>
        <BreadcrumbItem href={BASKET_ROUTE}>{translate.headerCart}</BreadcrumbItem>
        <BreadcrumbItem onClick={prevStep}>{translate.orderPageButton}</BreadcrumbItem>
        <BreadcrumbItem>{translate.paymentPageTitle}</BreadcrumbItem>
      </Breadcrumbs>
        <div className="flex justify-center">

          <form onSubmit={handleSubmit(handlePostPaymentOrder)} className="flex max-w-[500px] flex-col gap-[15px]">
           <h2 className="family-medium text-[32px]">{translate.paymentPayOrder}</h2>
            <div className="flex flex-col gap-[17px]">
              <label className="text-[18px] flex flex-col gap-[5px]">
               {translate.paymentCardNumber}
                <ReactInputMask
                  {...returnInputProperties("card_number")}
                  className='inputs-order'
                  mask= '9999-9999-9999-9999'
                  alwaysShowMask={true}
                  // onChange={handleInputCollectUserCardData}
                />
                {returnInputError("card_number")}
              </label>
            </div>

            <div className="flex flex-col gap-[17px]">
              <label className="text-[18px] flex flex-col gap-[5px]">
              {translate.paymentCardHolder}
                <input
                    {...returnInputProperties("cardholder_name")}
                    type="text"
                    className='inputs-order'
                    // onChange={handleInputCollectUserCardData}
                    placeholder={translate.paymentNameSurname}
                  />
                  {returnInputError("cardholder_name")}
              </label>
            </div>

            <div className="flex flex-col gap-[17px]">
              <label className="text-[18px] flex flex-col gap-[5px]">
                {translate.paymentCardMonth}
                <ReactInputMask
                  {...returnInputProperties("expiration_month")}
                  className='inputs-order'
                  mask= '99'
                  maskChar={''}
                  alwaysShowMask={true}
                  // onChange={handleInputCollectUserCardData}
                  placeholder="01"
                />
                {returnInputError("expiration_month")}
              </label>
            </div>

            <div className="flex flex-col gap-[17px]">
              <label className="text-[18px] flex flex-col gap-[5px]">
              {translate.paymentCardYear}
                <ReactInputMask
                  {...returnInputProperties("expiration_year")}
                    className='inputs-order'
                    mask= '9999'
                    maskChar={''}
                    alwaysShowMask={true}
                    // onChange={handleInputCollectUserCardData}
                    placeholder="0123"
                  />
                {returnInputError("expiration_year")}

              </label>
            </div>

            <div className="flex flex-col gap-[15px]">


          <div className="flex flex-col gap-[4px] text-textGray">
            <div className="flex justify-between">
              <p className="text-[24px] text-textGray">{translate.orderPageSum}</p>

              <p className="text-[24px] text-tiffani">
                {(Number(deliveryCost) + calculateTotalPrice()).toFixed(2)} $
              </p>
            </div>

            <div className="flex justify-between">
              <p>
                {returnAllProductsCounter()} {translate.orderPageProductsText}
              </p>

              <p>{calculateTotalPrice().toFixed(2)} $</p>
            </div>

            <div className="flex justify-between">
              <p>{translate.headerDelivery}</p>

              <p>{deliveryCost} $</p>
            </div>
          </div>

          <Button
            disabled={isSubmitting}
            type="submit"
            className="bg-tiffani text-[24px] text-white rounded-lg w-full h-[73px] py-[10px] flex flex-row justify-center items-center"
          >
            {/* {translate.orderPageButton} */}
            Оплатить {isSubmitting && <Icons id="spiner-payment"/>}
          </Button>

          <div className="text-textAcc">
            {translate.orderPageLinkText}{" "}
            <Link href={POLITIC_ROUTE} className="text-textGray politics">
              {translate.orderPageLink}
            </Link>
          </div>
         
        </div>
          </form>
        </div>
      </div>
    </main>
  );
}
