"use client";
//Global
import Image from "next/image";
import Link from "next/link";
//Images
import lcWaikiki from "@/public/assets/companies/lcWaikiki.png";
import armani from "@/public/assets/companies/armani.png";
import mavi from "@/public/assets/companies/mavi.png";
import koton from "@/public/assets/companies/koton.png";
import prada from "@/public/assets/companies/prada.png";
import fangi from "@/public/assets/companies/fangi.png";
import chanel from "@/public/assets/companies/chanel.png";
import defacto from "@/public/assets/companies/defacto.png";
import dior from "@/public/assets/companies/dior.png";
import luiviton from "@/public/assets/companies/luiviton.png";
import rolex from "@/public/assets/companies/rolex.png";
import colins from "@/public/assets/companies/colins.png";
import mapImg from "@/public/assets/other/mapImg.png";
//Hooks
import { useTranslate } from "@/hooks/useTranslate";
//Components
import { Icons } from "@/components/Icons/Icons";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
//Utils
import {
  MANUFACTURES_ROUTE,
  SHOP_EMAIL,
  SHOP_NAME,
  SHOP_PHONE,
  SHOP_ROUTE,
} from "@/utils/Consts";
//styles
import "swiper/css";
import "./about.scss";
import "swiper/css/pagination";

export default function About() {
  const translate = useTranslate();
  //Images
  const firstPartners = [
    { img: lcWaikiki, alt: "lcWaikiki" },
    { img: armani, alt: "armani" },
    { img: mavi, alt: "mavi" },
    { img: koton, alt: "koton" },
    { img: prada, alt: "prada" },
    { img: fangi, alt: "fangi" },
  ];
  const secondPartners = [
    { img: chanel, alt: "chanel" },
    { img: defacto, alt: "defacto" },
    { img: dior, alt: "dior" },
    { img: luiviton, alt: "luiviton" },
    { img: rolex, alt: "rolex" },
    { img: colins, alt: "colins" },
  ];

  const renderPartners = (imagesArray: typeof firstPartners | typeof secondPartners) => {
    return imagesArray.map((partner, index) => (
      <Image
        key={index}
        className="w-[100px] object-contain"
        src={partner.img}
        alt={partner.alt}
      />
    ));
  };

  return (
    <main className="container mx-auto mb-[70px] lg:mb-[100px] px-[15px] lg:px-[30px]">
      <Breadcrumbs>
        <BreadcrumbItem href={SHOP_ROUTE}>{translate.mainPageRoute}</BreadcrumbItem>
        <BreadcrumbItem>{translate.headerAbout}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="w-full mt-[30px] lg:mt-[48px]">
        <div className="w-full flex flex-col items-center mb-[40px] sm:mb-[60px]">
          <h1 className="family-bold text-[32px] xl:text-[40px] text-tiffani mb-[20px]">
            {SHOP_NAME}
          </h1>

          <p className="text-gray/500">{translate.aboutPageText}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-[40px] xl:gap-[80px]">
          <div className="w-full lg:flex-[0_1_50%] h-[280px] lg:h-[460px] bg-black"></div>

          <div className="flex flex-col flex-1">
            <h5 className="family-bold max-lg:text-center mb-[10px]">{translate.aboutPageTextProducts}</h5>

            <h2 className="family-bold text-[26px] sm:text-[32px] max-lg:text-center  xl:text-[40px] text-tiffani   mb-[20px]">
              {translate.aboutPageTextWork}
            </h2>

            <div className="flex max-lg:justify-center  gap-[60px]">
              <div className="flex flex-col gap-[20px]">
                <div className="flex flex-col">
                  <p className="family-bold text-[26px] sm:text-[32px] xl:text-[40px]">1000+</p>

                  <p className="family-bold  text-tiffani text-[15px]">
                    {translate.aboutPageTextOrder}
                  </p>
                </div>

                <div className="flex flex-col">
                  <p className="family-bold text-[26px] sm:text-[32px] xl:text-[40px]">15k</p>

                  <p className="family-bold  text-tiffani text-[15px]">
                    {translate.aboutPageTextStock}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-[20px]">
                <div className="flex flex-col">
                  <p className="family-bold text-[26px] sm:text-[32px] xl:text-[40px]">20+</p>

                  <p className="family-bold  text-tiffani text-[15px]">
                    {translate.aboutPageTextCountry}
                  </p>
                </div>

                <div className="flex flex-col">
                  <p className="family-bold text-[26px] sm:text-[32px] xl:text-[40px]">200+</p>

                  <p className="family-bold  text-tiffani text-[15px]">
                    {translate.aboutPageTextStars}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex text-center flex-col gap-[40px] relative mt-[40px] sm:mt-[70px] lg:mt-[100px]">
          <h2 className="family-bold   text-tiffani text-[26px] sm:text-[32px] xl:text-[40px]">
            {translate.aboutPageTextPartners}
          </h2>

          <div className="flex justify-center flex-wrap gap-[30px] lg:gap-[50px] cursor-pointer">
            {renderPartners(firstPartners)}
          </div>

          <div className="flex flex-wrap justify-center gap-[30px] lg:gap-[50px] cursor-pointer">
            {renderPartners(secondPartners)}
          </div>
        </div>

        <div className="flex flex-col items-center gap-[30px] mt-[40px] sm:mt-[70px] lg:mt-[100px]">
          <h2 className="family-bold   text-tiffani text-[26px] max-lg:text-center sm:text-[32px] xl:text-[40px]">
            {translate.aboutPageTextPopular}
          </h2>

          <Image src={mapImg} alt="map" />
          <div className="w-full flex justify-evenly">
            <div className="flex flex-col items-center gap-[12px]">
              <p className="family-bold text-tiffani ">{translate.aboutPageSupport}</p>

              <p className="text-gray/500 text-[14px] text-center">
                {translate.aboutPageSupportText}
              </p>

              <Link
                href="mailto:mis.express@mail.ru"
                className="family-bold   text-[14px]"
              >
                {SHOP_EMAIL}
              </Link>
            </div>

            <div className="flex flex-col items-center gap-[12px]">
              <p className="family-bold text-tiffani  ">{translate.aboutPagePhone}</p>

              <p className="text-gray/500 text-[14px] text-center">
                {translate.aboutPagePhoneText}
              </p>

              <Link
                href={`tel:${SHOP_PHONE}`}
                className="family-bold   text-[14px]"
              >
                {SHOP_PHONE}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
