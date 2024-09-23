"use client";
//Global
import { NextPage } from "next";
import React from "react";
import Link from "next/link";
//Hooks
import { useTranslate } from "@/hooks/useTranslate";
//Utils
import { SHOP_LINK } from "@/utils/Consts";

const SuccessfulPaymentPage: NextPage = () => {
  const { paymentSuccess, paymentSuccessText, paymentButton } = useTranslate();

  return (
    <div className="h-[358px] my-auto flex justify-center items-center flex-col gap-[40px]">
      <div className="flex flex-col gap-[20px]">
        <h5 className="text-black text-center font-medium text-[31px] lg:text-[50px]">
          {paymentSuccess}
        </h5>

        <p className="text-gray/500 text-[16px] text-center">
          {paymentSuccessText}
        </p>
      </div>

      <Link
        className="w-[187px] h-[44px] flex justify-center items-center bg-black text-white rounded-[5px] py-[10px] px-[20px] text-[14px]"
        href={SHOP_LINK}
      >
        {paymentButton}
      </Link>
    </div>
  );
};

export default SuccessfulPaymentPage;
