"use client";

//Components
import { Icons } from "@/components/Icons/Icons";

//Hooks
import { useTranslate } from "@/hooks/useTranslate";

//Styles
import "./payment.scss";

export default function Payment() {
  const {
    paymentPageBank,
    paymentPageBankText,
    paymentPageCard,
    paymentPageCardText,
    paymentPageCheck,
    paymentPageCheckText,
    paymentPageCrypto,
    paymentPageCryptoText,
    paymentPagePayPal,
    paymentPageText,
    paymentPageTitle,
  } = useTranslate();

  return (
    <main className="container mx-auto mt-[30px] mb-[100px] px-[28px] md:px-0">
      <div className="w-full mt-[48px]">
        <div className="w-full flex flex-col items-center mb-[60px]">
          <h1 className="family-bold text-[40px] text-tiffani font-semibold mb-[20px]">
            {paymentPageTitle}
          </h1>
          <p className="text-gray/500 text-center mb-[40px]">
            {paymentPageText}
          </p>
        </div>
        <div className="flex flex-col items-center gap-[50px]">
          <div className="flex flex-col md:flex-row justify-between gap-[30px]">
            <div className="flex flex-col items-center gap-[6px]">
              <Icons id="featureIcon" />
              <p className="family-medium text-tiffani font-medium">
                {paymentPageBank}
              </p>
              <p className="text-gray/500 text-center text-[13px]">
                {paymentPageBankText}
              </p>
            </div>
            <div className="flex flex-col items-center gap-[6px]">
              <Icons id="paymentIcon" />
              <p className="family-medium text-tiffani font-medium">
                {paymentPageCard}
              </p>
              <p className="text-gray/500 text-center text-[13px]">
                {paymentPageCardText}
              </p>
            </div>
            <div className="flex flex-col items-center gap-[6px]">
              <Icons id="paperIcon" />
              <p className="family-medium text-tiffani font-medium">
                {paymentPageCheck}
              </p>
              <p className="text-gray/500 text-center text-[13px]">
                {paymentPageCheckText}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-[50px]">
            <div className="flex flex-col items-center gap-[6px]">
              <Icons id="cryptoIcon" />
              <p className="family-medium text-tiffani font-medium">
                {paymentPageCrypto}
              </p>
              <p className="text-gray/500 text-center text-[13px]">
                {paymentPageCryptoText}
              </p>
            </div>
            <div className="flex flex-col items-center gap-[6px]">
              <Icons id="linkIcon" />
              <p className="family-medium text-tiffani font-medium">PayPal</p>
              <p className="text-gray/500 text-center text-[13px]">
                {paymentPagePayPal}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
