"use client";

//Global
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

//Components
import { Button, Input, Radio, RadioGroup } from "@nextui-org/react";
import { Icons } from "@/components/Icons/Icons";

//Hooks
import { useTranslate } from "@/hooks/useTranslate";
import { useTypedSelector } from "@/hooks/useReduxHooks";
import { useCart } from "@/hooks/useCart";

//Utils
import { POLITIC_ROUTE, PROFILE_ROUTE, SHOP_ROUTE } from "@/utils/Consts";

//Styles
import "./order.scss";
import { showToastMessage } from "../toastsChange";

export default function Order() {
  const { status: cartStatus } = useTypedSelector(state => state.cart),
    {
      isAuth,
      status: userStatus,
      userState,
    } = useTypedSelector(state => state.user);

  const { push } = useRouter();

  const { returnAllProductsCounter, calculateTotalPrice, onPostUserOrder } =
    useCart();

  useEffect(() => {
    if (!isAuth && userStatus === "fulfilled") push(SHOP_ROUTE);
  }, [isAuth, userStatus, push]);

  const {
    orderPageButton,
    orderPageCart,
    orderPageEmailText,
    orderPageLink,
    orderPageLinkText,
    orderPagePayment,
    orderPagePersonalData,
    orderPagePhone,
    orderPageProductsText,
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

  const mapPayments = () => {
    const payments = [
      paymentPageBank,
      paymentPageCard,
      paymentPageCheck,
      paymentPageCrypto,
      "PayPal",
    ];

    return payments.map(value => (
      <Radio key={value} classNames={{ label: "text-textAcc" }} value={value}>
        {value}
      </Radio>
    ));
  };

  const handleButtonClick = () => {
    push(PROFILE_ROUTE);
    showToastMessage("success", "Здесь вы изменить свои данные для заказа!");
  };

  const inputClassName = {
    inputWrapper: "border-1 border-border shadow-none rounded-md",
  };

  if (!isAuth || userStatus === "pending" || cartStatus === "pending")
    return <Icons id="spiner" />;

  return (
    <main className="container mx-auto mt-[30px] mb-[100px] px-[28px] md:px-0">
      <div className="w-full flex flex-col lg:grid grid-cols-2 gap-[79px]">
        <div className="flex flex-col gap-[45px]">
          <h2 className="family-medium text-[32px]">{orderPagePersonalData}</h2>

          <form className="flex flex-col gap-[20px]">
            <div className="flex flex-col gap-[17px]">
              <label className="text-[18px] flex flex-col gap-[5px]">
                {registrationLabelName}

                <Input
                  readOnly
                  classNames={inputClassName}
                  value={userState?.user.first_name}
                />
              </label>
            </div>

            <div className="flex flex-col gap-[17px]">
              <label className="text-[18px] flex flex-col gap-[5px]">
                {orderPagePhone}

                <Input
                  readOnly
                  value={userState?.phone_number}
                  type="phone"
                  classNames={inputClassName}
                />
              </label>
            </div>
            <div className="flex flex-col gap-[17px]">
              <label className="text-[18px] flex flex-col gap-[5px]">
                {registrationLabelEmail}

                <Input
                  classNames={inputClassName}
                  readOnly
                  value={userState?.user.email}
                />

                <span className="text-[12px] text-textAcc">
                  {orderPageEmailText}
                </span>
              </label>
            </div>

            <Button onClick={handleButtonClick} className="button-change">
              Изменить
            </Button>
          </form>
        </div>

        <div className="flex flex-col gap-[15px]">
          <h2 className="text-[32px] family-medium">{orderPageCart}</h2>

          <p className="text-[20px] text-textGray">{orderPageTotal}:</p>

          <div className="flex flex-col gap-[4px] text-textGray">
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
          </div>

          <Button
            onClick={onPostUserOrder}
            className="bg-tiffani text-[24px] text-white rounded-lg w-full h-[73px] py-[10px]"
          >
            {orderPageButton}
          </Button>

          <div className="text-textAcc">
            {orderPageLinkText}{" "}
            <Link href={POLITIC_ROUTE} className="text-textGray politics">
              {orderPageLink}
            </Link>
          </div>

          <div className="flex flex-col">
            <p className="text-[18px]">{orderPagePayment}</p>

            <RadioGroup>{mapPayments()}</RadioGroup>
          </div>
        </div>
      </div>
    </main>
  );
}
