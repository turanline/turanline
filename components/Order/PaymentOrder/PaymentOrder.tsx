"use client";
//Global
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { showToastMessage } from "@/app/toastsChange";
import ReactInputMask from "react-input-mask";
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
//Utils
import {
  POLITIC_ROUTE,
  SHOP_ROUTE,
} from "@/utils/Consts";
//Styles
import "./PaymentOrder.scss";

const cardsArray = [
  {
    name: "Mastercard",
    value: 2,
  },
  {
    name: "Visa",
    value: 1,
  }
];

export default function PaymentOrder({prevStep}: {prevStep: () => void}) {
  const { push } = useRouter();
  const translate = useTranslate();
  const { status: cartStatus } = useTypedSelector(state => state.cart);
  const { isAuth,status: userStatus } = useTypedSelector(state => state.user);
  const { returnAllProductsCounter, calculateTotalPrice } = useCart();
  const [userCardData, setUserCardData] = useState(
    {
      card_number: "",
      expiration_year: "",
      expiration_month: "",
      cvv: "",
      cardholder_name: "",
      payment_system: ""
    },
  );
  const deliveryCost = localStorage.getItem('deliveryCost');
        


  const renderCardSystem = () => {
    if(!cardsArray?.length) return(
      <SelectItem aria-label="select-error" key='error'>Error</SelectItem>
    );

    return(cardsArray?.map(({name,value}) => (
      <SelectItem aria-label="select-cardSystem"  key={value} data-value={value} onClick={()=> handleDropDownCollectCardSystem(String(value))}>{name}</SelectItem>
  )));
  };

  //Handle
  const handlePostUserOrder = () => {
    const requestBody = {
      content_object:userCardData,
      comment: "test",
    };

    console.log(requestBody)
  };


  const handleInputCollectUserCardData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserCardData(prevData => ({
      ...prevData,
      [name]: value.replace(/-/g, '')
    }));
  };
  const handleDropDownCollectCardSystem = (system: string) => {
    setUserCardData(prevData => ({
      ...prevData,
      payment_system: system
    }));
  };

  useEffect(() => {
    if (!isAuth && userStatus === "fulfilled") push(SHOP_ROUTE);
  }, [isAuth, userStatus, push]);

  if (!isAuth || userStatus === "pending" || cartStatus === "pending")
    return <Icons id="spiner" />;

  return (
    <main className="container mx-auto mt-[30px] mb-[100px] px-[28px] sm:px-0">

      <div className="w-full flex flex-col gap-[30px]">
      <button className="w-[65px] gap-[5px] flex flex-row items-center" onClick={prevStep}>Назад <Icons id='arrowBlack'/></button>
        <div className="flex justify-center">

          <form className="flex max-w-[500px] flex-col gap-[15px]">
           <h2 className="family-medium text-[32px]">Оплатить заказ</h2>
            <div className="flex flex-col gap-[17px]">
              <label className="text-[18px] flex flex-col gap-[5px]">
                Номер карты
                <ReactInputMask
                  name="card_number"
                  className='inputs-order'
                  mask= '9999-9999-9999-9999'
                  alwaysShowMask={true}
                  onChange={handleInputCollectUserCardData}
                />
              </label>
            </div>

            <div className="flex flex-col gap-[17px]">
              <label className="text-[18px] flex flex-col gap-[5px]">
              Имя держателя карты
                <input
                    type="text"
                    className='inputs-order'
                    name="cardholder_name"
                    onChange={handleInputCollectUserCardData}
                  />
              </label>
            </div>

            <div className="flex flex-col gap-[17px]">
              <label className="text-[18px] flex flex-col gap-[5px]">
                CVV
                <ReactInputMask
                  className='inputs-order'
                  mask= '999'
                  maskChar={''}
                  name="cvv"
                  onChange={handleInputCollectUserCardData}
                  alwaysShowMask={true}
                />
              </label>
            </div>

            <div className="flex flex-col gap-[17px]">
              <label className="text-[18px] flex flex-col gap-[5px]">
                Срок действия карты - Месяц
                <ReactInputMask
                  className='inputs-order'
                  mask= '99'
                  maskChar={''}
                  alwaysShowMask={true}
                  name="expiration_month"
                  onChange={handleInputCollectUserCardData}
                />
              </label>
            </div>

            <div className="flex flex-col gap-[17px]">
              <label className="text-[18px] flex flex-col gap-[5px]">
              Срок действия карты - Год
                <ReactInputMask
                    className='inputs-order'
                    mask= '99'
                    maskChar={''}
                    alwaysShowMask={true}
                    name="expiration_year"
                    onChange={handleInputCollectUserCardData}
                  />
              </label>
            </div>

            <div className="flex flex-col gap-[17px]">
              <label className="text-[18px] flex flex-col gap-[5px]">
                Visa/Mastercard
                <Select
                  label={'Тип карты'}
                  aria-label="Select a card system"
                  radius="none"
                  disallowEmptySelection
                  classNames={{
                    trigger: "border-1 border-border shadow-none rounded-md",
                  }}
                >
                  {renderCardSystem()}
                </Select>
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
            onClick={handlePostUserOrder}
            className="bg-tiffani text-[24px] text-white rounded-lg w-full h-[73px] py-[10px]"
          >
            {/* {translate.orderPageButton} */}
            Оплатить
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
