"use client";

//Global
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

//Components
import {
  Button,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Icons } from "@/components/Icons/Icons";
import InputMask from "react-input-mask";

//Hooks
import { useTranslate } from "@/hooks/useTranslate";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useCart } from "@/hooks/useCart";

//Utils
import { POLITIC_ROUTE, SHOP_ROUTE } from "@/utils/Consts";

//Styles
import "./order.scss";

export default function Order() {
  const { status: cartStatus } = useTypedSelector(state => state.cart),
    { isAuth, status: userStatus } = useTypedSelector(state => state.user);

  const { push } = useRouter();

  const { calculateTotalPrice, returnAllProductsCounter } = useCart();

  useEffect(() => {
    if (!isAuth && userStatus === "fulfilled") push(SHOP_ROUTE);
  }, [isAuth, userStatus, push]);

  const {
    orderPageAddress,
    orderPageButton,
    orderPageCart,
    orderPageDiscount,
    orderPageEmailText,
    orderPageLink,
    orderPageLinkText,
    orderPagePayment,
    orderPagePersonalData,
    orderPagePhone,
    orderPageProductsText,
    orderPageSearch,
    orderPageSum,
    orderPageTotal,
    registrationLabelName,
    registrationLabelEmail,
    headerDelivery,
    paymentPageBank,
    paymentPageCard,
    paymentPageCheck,
    paymentPageCrypto,
  } = useTranslate();

  const payments = [
    paymentPageBank,
    paymentPageCard,
    paymentPageCheck,
    paymentPageCrypto,
    "PayPal",
  ];

  if (!isAuth || userStatus === "pending" || cartStatus === "pending")
    return <Icons id="spiner" />;

  return (
    <main className="container mx-auto mt-[30px] mb-[100px] px-[28px] md:px-0">
      <div className="w-full flex flex-col lg:grid grid-cols-2 gap-[79px]">
        <div className="flex flex-col">
          <h2 className="family-medium text-[32px] mb-[46px]">
            {orderPagePersonalData}
          </h2>
          <form className="flex flex-col gap-[20px]">
            <div className="flex flex-col gap-[17px]">
              <label htmlFor="" className="text-[18px]">
                {registrationLabelName} *
              </label>
              <Input
                classNames={{
                  input: "px-[21px]",
                  inputWrapper: "border-1 border-border shadow-none rounded-md",
                }}
                placeholder="Имя *"
              />
            </div>
            <div className="flex flex-col gap-[17px]">
              <label htmlFor="" className="text-[18px]">
                {orderPagePhone} *
              </label>
              <div className="flex">
                <Select
                  disallowEmptySelection
                  defaultSelectedKeys={["+7"]}
                  className="max-w-xs"
                  classNames={{
                    innerWrapper: "w-fit",
                    popoverContent: "w-[74px]",
                    mainWrapper: "w-[74px]",
                    base: "w-[74px]",
                    trigger:
                      "rounded-md rounded-r-none shadow-none w-[74px] border-1 border-r-0 border-border",
                  }}
                >
                  <SelectItem key="+7" value="+7">
                    +7
                  </SelectItem>
                </Select>
                <InputMask
                  alwaysShowMask
                  mask="(999) 999-99-99"
                  className="w-full bg-gray-search focus:outline-none border-1 border-border px-[21px] rounded-r-md"
                  placeholder="(999) 999-99-99"
                  type="phone"
                />
              </div>
            </div>
            <div className="flex flex-col gap-[17px]">
              <label htmlFor="" className="text-[18px]">
                {registrationLabelEmail} *
              </label>
              <Input
                classNames={{
                  input: "px-[21px]",
                  inputWrapper: "border-1 border-border shadow-none rounded-md",
                }}
                placeholder={`${registrationLabelEmail} *`}
              />
              <p className="text-[12px] text-textAcc">{orderPageEmailText}</p>
            </div>
            <div className="flex flex-col gap-[17px]">
              <label htmlFor="" className="text-[18px]">
                {orderPageAddress}
              </label>
              <div className="flex h-[56px]">
                <div className="flex items-center w-full lg:w-[600px] h-full bg-gray-search border-1 border-border rounded-l-md gap-[4px] sm:gap-[40px]">
                  <input
                    className="w-full bg-gray-search focus:outline-none pl-[16px] sm:px-[16px]"
                    type="text"
                    placeholder={orderPageSearch}
                  />
                  <div className="flex items-center w-[160px] h-full border-l-1 border-border p-[13px] gap-[8px] sm:gap-[14px]">
                    <Icons id="address" />
                    <p className="text-textAcc text-[14px]">Россия</p>
                  </div>
                </div>
                <button className="h-full bg-tiffani rounded-r-md px-[28px]">
                  <Icons id="search" />
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="flex flex-col">
          <h2 className="text-[32px] family-medium mb-[46px]">
            {orderPageCart}
          </h2>
          <p className="text-[12px] text-textGray">{orderPageTotal}:</p>
          <div className="flex flex-col gap-[4px] text-textGray mb-[23px]">
            <div className="flex justify-between">
              <p className="text-[24px] text-textGray">{orderPageSum}</p>
              <p className="text-[24px] text-tiffani">
                {calculateTotalPrice().toFixed(2)} $
              </p>
            </div>
            <div className="flex justify-between">
              <p>
                {returnAllProductsCounter()} {orderPageProductsText}
              </p>

              <p>{calculateTotalPrice().toFixed(2)} $</p>
            </div>
            <div className="flex justify-between">
              <p>{headerDelivery}</p>
              <p>1000 $</p>
            </div>
            <div className="flex justify-between">
              <p>{orderPageDiscount}</p>
              <p>- 500$</p>
            </div>
          </div>
          <Button className="bg-tiffani text-[24px] text-white rounded-lg w-full h-[73px] py-[10px] mb-[14px]">
            {orderPageButton}
          </Button>
          <div className="text-textAcc mb-[42px]">
            {orderPageLinkText}{" "}
            <Link href={POLITIC_ROUTE} className="text-textGray politics">
              {orderPageLink}
            </Link>
          </div>
          <div className="flex flex-col">
            <p className="text-[18px] mb-[14px]">{orderPagePayment}</p>
            <RadioGroup>
              {payments.map(value => (
                <Radio
                  key={value}
                  classNames={{ label: "text-textAcc" }}
                  value={value}
                >
                  {value}
                </Radio>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>
    </main>
  );
}
