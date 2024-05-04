"use client";

//Global
import Image from "next/image";

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

//Components
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";

//Hooks
import { useTranslate } from "@/hooks/useTranslate";

//Utils
import { MANUFACTURES_ROUTE, SHOP_ROUTE } from "@/utils/Consts";

//Styles
import "swiper/css";
import "swiper/css/pagination";
import "./manufacturers.scss";

export default function Category() {
  const { mainPageRoute, manufacturersPageRoute, manufacturersPageText } =
    useTranslate();

  return (
    <main className="container mx-auto mt-[30px] mb-[100px] px-[28px] sm:px-0">
      <Breadcrumbs>
        <BreadcrumbItem href={SHOP_ROUTE}>{mainPageRoute}</BreadcrumbItem>

        <BreadcrumbItem href={MANUFACTURES_ROUTE}>
          {manufacturersPageRoute}
        </BreadcrumbItem>
      </Breadcrumbs>

      <div className="flex flex-col items-center">
        <h2 className="text-[26px] sm:text-[40px] text-tiffani font-bold">
          {manufacturersPageRoute}
        </h2>

        <p className="text-[#667085] text-center">{manufacturersPageText}</p>
      </div>
      <div className="flex flex-col gap-[40px] mt-[100px]">
        <div className="flex justify-evenly sm:justify-between cursor-pointer">
          <Image className="object-contain" src={lcWaikiki} alt="lcWaikiki" />
          <Image className="object-contain" src={armani} alt="armani" />
          <Image
            className="hidden sm:block object-contain"
            src={mavi}
            alt="mavi"
          />
          <Image
            className="hidden sm:block object-contain"
            src={koton}
            alt="koton"
          />
          <Image
            className="hidden md:block object-contain"
            src={prada}
            alt="prada"
          />
          <Image
            className="hidden md:block object-contain"
            src={fangi}
            alt="fangi"
          />
        </div>
        <div className="flex justify-evenly sm:justify-between cursor-pointer">
          <Image className="object-contain" src={chanel} alt="chanel" />
          <Image className="object-contain" src={defacto} alt="defacto" />
          <Image
            className="hidden sm:block object-contain"
            src={dior}
            alt="dior"
          />
          <Image
            className="hidden sm:block object-contain"
            src={luiviton}
            alt="luiviton"
          />
          <Image
            className="hidden md:block object-contain"
            src={rolex}
            alt="rolex"
          />
          <Image
            className="hidden md:block object-contain"
            src={colins}
            alt="colins"
          />
        </div>
        <div className="flex justify-evenly sm:justify-between cursor-pointer">
          <Image className="object-contain" src={lcWaikiki} alt="lcWaikiki" />
          <Image className="object-contain" src={armani} alt="armani" />
          <Image
            className="hidden sm:block object-contain"
            src={mavi}
            alt="mavi"
          />
          <Image
            className="hidden sm:block object-contain"
            src={koton}
            alt="koton"
          />
          <Image
            className="hidden md:block object-contain"
            src={prada}
            alt="prada"
          />
          <Image
            className="hidden md:block object-contain"
            src={fangi}
            alt="fangi"
          />
        </div>
        <div className="flex justify-evenly sm:justify-between cursor-pointer">
          <Image className="object-contain" src={chanel} alt="chanel" />
          <Image className="object-contain" src={defacto} alt="defacto" />
          <Image
            className="hidden sm:block object-contain"
            src={dior}
            alt="dior"
          />
          <Image
            className="hidden sm:block object-contain"
            src={luiviton}
            alt="luiviton"
          />
          <Image
            className="hidden md:block object-contain"
            src={rolex}
            alt="rolex"
          />
          <Image
            className="hidden md:block object-contain"
            src={colins}
            alt="colins"
          />
        </div>
        <div className="flex justify-evenly sm:justify-between cursor-pointer">
          <Image className="object-contain" src={lcWaikiki} alt="lcWaikiki" />
          <Image className="object-contain" src={armani} alt="armani" />
          <Image
            className="hidden sm:block object-contain"
            src={mavi}
            alt="mavi"
          />
          <Image
            className="hidden sm:block object-contain"
            src={koton}
            alt="koton"
          />
          <Image
            className="hidden md:block object-contain"
            src={prada}
            alt="prada"
          />
          <Image
            className="hidden md:block object-contain"
            src={fangi}
            alt="fangi"
          />
        </div>
        <div className="flex justify-evenly sm:justify-between cursor-pointer">
          <Image className="object-contain" src={chanel} alt="chanel" />
          <Image className="object-contain" src={defacto} alt="defacto" />
          <Image
            className="hidden sm:block object-contain"
            src={dior}
            alt="dior"
          />
          <Image
            className="hidden sm:block object-contain"
            src={luiviton}
            alt="luiviton"
          />
          <Image
            className="hidden md:block object-contain"
            src={rolex}
            alt="rolex"
          />
          <Image
            className="hidden md:block object-contain"
            src={colins}
            alt="colins"
          />
        </div>
      </div>
    </main>
  );
}
