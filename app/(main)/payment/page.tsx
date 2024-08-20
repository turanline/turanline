"use client";
//Components
import { Icons } from "@/components/Icons/Icons";
//Hooks
import { useTranslate } from "@/hooks/useTranslate";
//Styles
import "./payment.scss";

export default function Payment() {
  const translate = useTranslate();

  return (
    <main className="container mx-auto mt-[30px] mb-[100px] px-[15px] lg:px-[30px]">
      <div className="w-full mt-[48px]">
        <div className="w-full flex flex-col items-center mb-[60px]">
          <h1 className="family-bold text-[40px] text-tiffani font-semibold mb-[20px]">
            {translate.paymentPageTitle}
          </h1>
          <p className="text-gray/500 text-center mb-[40px]">
            {translate.paymentPageText}
          </p>
        </div>
        <div className="flex flex-col items-center gap-[50px]">
          <div className="flex flex-col md:flex-row justify-between gap-[30px]">
            <div className="flex flex-col items-center gap-[6px]">
              <Icons id="featureIcon" />
              <p className="family-medium text-tiffani font-medium">
                Оплата банком
              </p>
              <p className="text-gray/500 text-center text-[13px]">
                {translate.paymentPageBankText}
              </p>
            </div>
            <div className="flex flex-col items-center gap-[6px]">
              <Icons id="paymentIcon" />
              <p className="family-medium text-tiffani font-medium">
                Оплата картой
              </p>
              <p className="text-gray/500 text-center text-[13px]">
                {translate.paymentPageCardText}
              </p>
            </div>
            <div className="flex flex-col items-center gap-[6px]">
              <Icons id="paperIcon" />
              <p className="family-medium text-tiffani font-medium">
                Оплата чеком
              </p>
              <p className="text-gray/500 text-center text-[13px]">
                {translate.paymentPageCheckText}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-[50px]">
            <div className="flex flex-col items-center gap-[6px]">
              <Icons id="cryptoIcon" />
              <p className="family-medium text-tiffani font-medium">
                Криптовалютой
              </p>
              <p className="text-gray/500 text-center text-[13px]">
                {translate.paymentPageCryptoText}
              </p>
            </div>
            <div className="flex flex-col items-center gap-[6px]">
              <Icons id="linkIcon" />
              <p className="family-medium text-tiffani font-medium">PayPal</p>
              <p className="text-gray/500 text-center text-[13px]">
                {translate.paymentPagePayPal}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
