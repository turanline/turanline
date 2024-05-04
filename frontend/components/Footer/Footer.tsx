"use client";

//Global
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

//Components
import { Icons } from "../Icons/Icons";

//Hooks
import { useTranslate } from "@/hooks/useTranslate";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useCategories } from "@/hooks/useCategories";

//Utils
import {
  ABOUT_ROUTE,
  CONTACTS_ROUTE,
  DELIVERY_ROUTE,
  PAYMENT_ROUTE,
  POLITIC_ROUTE,
  SHOP_ADDRESS,
  SHOP_EMAIL,
  SHOP_INSTAGRAM,
  SHOP_NAME,
  SHOP_PHONE,
  SHOP_PHONE_2,
  SHOP_ROUTE,
  SHOP_TELEGRAM,
  SHOP_WHATSAPP,
} from "@/utils/Consts";

//Images
import logo from "../../public/assets/other/logo.svg";

//Styles
import "./Footer.scss";

export default function Footer() {
  const {
    footerPayment,
    footerPolitics,
    footerTextUnderEmail,
    footerUsing,
    footerWriteUs,
    headerAbout,
    headerDelivery,
  } = useTranslate();

  const { categories } = useTypedSelector(state => state.categories);

  const { onSetCategories, mapCategoriesOnDesktop } = useCategories();

  useEffect(() => {
    onSetCategories();
  }, []);

  return (
    <footer>
      <div className="container mx-auto mb-[47px] px-[28px] md:px-0">
        <div className="hidden md:flex justify-between items-center mb-[32px]">
          <Link href={SHOP_ROUTE}>
            <Image src={logo} alt="logo" />
          </Link>
          <div className="flex gap-[57px]">
            <Link href={ABOUT_ROUTE}>{headerAbout}</Link>
            <Link href={DELIVERY_ROUTE}>{headerDelivery}</Link>
            <Link href={PAYMENT_ROUTE}>{footerPayment}</Link>
            <Link href={POLITIC_ROUTE}>{footerPolitics}</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 md:flex w-full justify-between">
          <div className="flex flex-col md:hidden justify-between md:items-center gap-[18px] md:gap-0">
            <Link href={SHOP_ROUTE}>
              <Image src={logo} alt="logo" />
            </Link>
            <div className="flex flex-col gap-[16px] md:gap-[57px]">
              <Link href={ABOUT_ROUTE}>{headerAbout}</Link>
              <Link href={DELIVERY_ROUTE}>{headerDelivery}</Link>
              <Link href={PAYMENT_ROUTE}>{footerPayment}</Link>
              <Link href={CONTACTS_ROUTE}>{}</Link>
            </div>
          </div>
          <div className="w-full flex flex-col-reverse md:flex-row md:justify-between items-center gap-[10px] md:gap-[32px]">
            <div className="w-full flex flex-col-reverse md:flex-col gap-[12px] md:gap-[32px]">
              <p className="family_bold footer_shop_address">{SHOP_ADDRESS}</p>
              <div className="flex flex-col sm:flex-row lg:hidden sm:items-center gap-[13px]">
                <p className="font-bold">{footerWriteUs}:</p>
                <div className="flex gap-[13px]">
                  <Link href={SHOP_TELEGRAM}>
                    <Icons id="telegram" />
                  </Link>
                  <Link href={SHOP_WHATSAPP}>
                    <Icons id="whatsapp" />
                  </Link>
                  <Link href={SHOP_INSTAGRAM}>
                    <Icons id="instagram" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col lg:flex-row justify-between gap-[15px]">
              <div className="flex flex-col">
                <Link href={`tel:${SHOP_PHONE}`}>{SHOP_PHONE}</Link>
                <Link href={`tel:${SHOP_PHONE_2}`}>{SHOP_PHONE_2}</Link>
              </div>
              <div className="flex flex-col">
                <Link
                  className="family_bold text-[14px] sm:text-[16px] text-tiffani font-bold"
                  href={`mailto:${SHOP_EMAIL}`}
                >
                  {SHOP_EMAIL}
                </Link>
                <p className="hidden md:block text-[10px]">
                  {footerTextUnderEmail}
                </p>
              </div>
            </div>
            <div className="w-full hidden lg:flex items-center justify-end gap-[13px]">
              <p className="family_bold">{footerWriteUs}:</p>
              <Link href={SHOP_TELEGRAM}>
                <Icons id="telegram" />
              </Link>
              <Link href={SHOP_WHATSAPP}>
                <Icons id="whatsapp" />
              </Link>
              <Link href={SHOP_INSTAGRAM}>
                <Icons id="instagram" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block w-full bg-tiffani mb-[24px]">
        {mapCategoriesOnDesktop()}
      </div>
      <div className="w-full container mx-auto flex justify-between items-center mb-4 px-[28px] sm:px-0">
        <p className="text-[10px]">{footerUsing}</p>
        <p className="hidden sm:block">{`© ${SHOP_NAME}`}</p>
      </div>
    </footer>
  );
}
