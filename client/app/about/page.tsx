"use client";

//Global
import Image from "next/image";
import Link from "next/link";

//Images
import lcWaikiki from "../../public/assets/companies/lcWaikiki.png";
import armani from "../../public/assets/companies/armani.png";
import mavi from "../../public/assets/companies/mavi.png";
import koton from "../../public/assets/companies/koton.png";
import prada from "../../public/assets/companies/prada.png";
import fangi from "../../public/assets/companies/fangi.png";
import chanel from "../../public/assets/companies/chanel.png";
import defacto from "../../public/assets/companies/defacto.png";
import dior from "../../public/assets/companies/dior.png";
import luiviton from "../../public/assets/companies/luiviton.png";
import rolex from "../../public/assets/companies/rolex.png";
import colins from "../../public/assets/companies/colins.png";
import mapImg from "../../public/assets/other/mapImg.png";

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
  const {
    mainPageRoute,
    headerAbout,
    lookAll,
    aboutPageText,
    aboutPagePhone,
    aboutPagePhoneText,
    aboutPageSupport,
    aboutPageSupportText,
    aboutPageTextOrder,
    aboutPageTextPartners,
    aboutPageTextPopular,
    aboutPageTextProducts,
    aboutPageTextStars,
    aboutPageTextStock,
    aboutPageTextWork,
    aboutPageTextCountry,
  } = useTranslate();

  return (
    <main className="container mx-auto mt-[30px] mb-[100px] px-[28px] md:px-0">
      <Breadcrumbs>
        <BreadcrumbItem href={SHOP_ROUTE}>{mainPageRoute}</BreadcrumbItem>
        <BreadcrumbItem>{headerAbout}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="w-full mt-[48px]">
        <div className="w-full flex flex-col items-center mb-[60px]">
          <h1 className="family-bold text-[40px] text-tiffani mb-[20px]">
            {SHOP_NAME}
          </h1>
          <p className="text-gray/500 mb-[40px]">{aboutPageText}</p>
        </div>
        <div className="grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 gap-[80px]">
          <div className="w-full h-[460px] bg-black"></div>
          <div className="flex flex-col">
            <h5 className="family-bold  mb-[10px]">{aboutPageTextProducts}</h5>
            <h2 className="family-bold  text-[40px] text-tiffani   mb-[20px]">
              {aboutPageTextWork}
            </h2>
            <div className="flex gap-[60px]">
              <div className="flex flex-col gap-[20px]">
                <div className="flex flex-col">
                  <p className="family-bold    text-[40px]">1000+</p>
                  <p className="family-bold  text-tiffani text-[15px]">
                    {aboutPageTextOrder}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="family-bold    text-[40px]">15k</p>
                  <p className="family-bold  text-tiffani text-[15px]">
                    {aboutPageTextStock}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-[20px]">
                <div className="flex flex-col">
                  <p className="family-bold    text-[40px]">20+</p>
                  <p className="family-bold  text-tiffani text-[15px]">
                    {aboutPageTextCountry}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="family-bold    text-[40px]">200+</p>
                  <p className="family-bold  text-tiffani text-[15px]">
                    {aboutPageTextStars}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-center relative mb-[100px]">
          <div className="flex text-center flex-col gap-[40px] mt-[100px]">
            <h2 className="family-bold   text-tiffani text-[40px]">
              {aboutPageTextPartners}
            </h2>
            <div className="flex gap-[30px] lg:gap-[50px] ml-[67px] cursor-pointer">
              <Image
                className="w-[100px] object-contain"
                src={lcWaikiki}
                alt="lcWaikiki"
              />
              <Image
                className="w-[100px] object-contain"
                src={armani}
                alt="armani"
              />
              <Image
                className="w-[100px] object-contain"
                src={mavi}
                alt="mavi"
              />
              <Image
                className="w-[100px] object-contain"
                src={koton}
                alt="koton"
              />
              <Image
                className="w-[100px] object-contain"
                src={prada}
                alt="prada"
              />
              <Image
                className="w-[100px] object-contain"
                src={fangi}
                alt="fangi"
              />
            </div>
            <div className="flex gap-[30px] lg:gap-[50px] cursor-pointer">
              <Image
                className="w-[100px] object-contain"
                src={chanel}
                alt="chanel"
              />
              <Image
                className="w-[100px] object-contain"
                src={defacto}
                alt="defacto"
              />
              <Image
                className="w-[100px] object-contain"
                src={dior}
                alt="dior"
              />
              <Image
                className="w-[100px] object-contain"
                src={luiviton}
                alt="luiviton"
              />
              <Image
                className="w-[100px] object-contain"
                src={rolex}
                alt="rolex"
              />
              <Image
                className="w-[100px] object-contain"
                src={colins}
                alt="colins"
              />
            </div>
          </div>

          <div className="absolute right-0 bottom-[-50px] flex gap-[7px] items-center mt-[30px]">
            <Link href={MANUFACTURES_ROUTE}>{lookAll}</Link>
            <Icons id="arrowBlack" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-[44px]">
          <h2 className="family-bold   text-tiffani text-[40px]">
            {aboutPageTextPopular}
          </h2>
          <Image src={mapImg} alt="map" />
          <div className="w-full flex justify-evenly">
            <div className="flex flex-col items-center gap-[12px]">
              <p className="family-bold text-tiffani ">{aboutPageSupport}</p>
              <p className="text-gray/500 text-[14px] text-center">
                {aboutPageSupportText}
              </p>
              <Link
                href="mailto:mis.express@mail.ru"
                className="family-bold   text-[14px]"
              >
                {SHOP_EMAIL}
              </Link>
            </div>
            <div className="flex flex-col items-center gap-[12px]">
              <p className="family-bold text-tiffani  ">{aboutPagePhone}</p>
              <p className="text-gray/500 text-[14px] text-center">
                {aboutPagePhoneText}
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
