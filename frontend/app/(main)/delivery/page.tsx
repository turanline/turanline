"use client";
//Components
import Image from "next/image";
//Utils
import { SHOP_ROUTE } from "@/utils/Consts";
//Images
import magnumCargo from "@/public/assets/companies/magnumCargo.png";
import skKargo from "@/public/assets/companies/skKargo.png";
import kargo63 from "@/public/assets/companies/kargo63.png";
import kitkaTrans from "@/public/assets/companies/kitkaTrans.png";
import coupex from "@/public/assets/companies/coupex.png";
//Components
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
//Hooks
import { useTranslate } from "@/hooks/useTranslate";
//Styles
import "./delivery.scss";

export default function Delivery() {

  const translate = useTranslate();

  return (
    <main className="container mx-auto mb-[100px] px-[15px] lg:px-[30px]">
      <Breadcrumbs>
        <BreadcrumbItem href={SHOP_ROUTE}>{translate.mainPageRoute}</BreadcrumbItem>

        <BreadcrumbItem>{translate.headerDelivery}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="w-full mt-[30px] sm:mt-[48px]">
        <div className="w-full flex flex-col items-center mb-[40px]">
          <h1 className="family-bold text-[32px] xl:text-[40px] text-black mb-[20px]">
            {translate.deliveryPageTitle}
          </h1>

          <p className="text-gray/500 text-center">
            {translate.deliveryPageText}
          </p>
        </div>
        <div className="flex flex-col items-center gap-[60px] lg:gap-[100px]">
          <div className="flex flex-col md:flex-row justify-between gap-[60px] lg:gap-[100px]">
            <Image className="w-full" src={skKargo} alt="kargo" />

            <Image className="w-full" src={kitkaTrans} alt="kargo" />

            <Image className="w-full" src={magnumCargo} alt="kargo" />
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-[60px] lg:gap-[100px]">
            <Image className="w-full" src={coupex} alt="kargo" />

            <Image className="w-full" src={kargo63} alt="kargo" />
          </div>
        </div>
      </div>
    </main>
  );
}
