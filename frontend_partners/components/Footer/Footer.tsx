"use client";
//Global
import Image from "next/image";
import Link from "next/link";
//Components
import { Icons } from "../Icons/Icons";
//Hooks
import { useTranslate } from "@/hooks/useTranslate";
//Utils
import {
  POLITIC_ROUTE,
  CLIENT_ROUTE,
  SHOP_ADDRESS,
  SHOP_EMAIL,
  SHOP_INSTAGRAM,
  SHOP_NAME,
  SHOP_PHONE,
  SHOP_ROUTE,
  SHOP_TELEGRAM,
  SHOP_WHATSAPP,
  SHOP_SECOND_PHONE,
} from "@/utils/Consts";
//Images
import logo from "../../public/assets/other/logo.png";
//Styles
import "./Footer.scss";

export function Footer() {
  const translate = useTranslate();


  return (
    <footer>
      <div className="footer-main-wrapper container w-full mx-auto mb-[47px] md:px-0">
        <nav className="hidden md:flex justify-between items-center mb-[32px]">
          <Link href={SHOP_ROUTE}>
            <Image width={100} height={50} src={logo} alt="logo" />
          </Link>
          <div className="flex gap-[57px]">
            <Link href={POLITIC_ROUTE}>{translate.footerPolitics}</Link>
            <Link href={CLIENT_ROUTE}>{translate.footerProviders}</Link>
          </div>
        </nav>
        <nav className="grid grid-cols-2 md:flex w-full justify-between">
          <div className="flex flex-col md:hidden justify-between md:items-center gap-[18px] md:gap-0">
            <Link href={SHOP_ROUTE}>
              <Image width={100} height={50} src={logo} alt="logo" />
            </Link>
            <div className="flex flex-col gap-[16px] md:gap-[57px] link-wrapper">
            <Link href={POLITIC_ROUTE}>{translate.footerPolitics}</Link>
              <Link href={CLIENT_ROUTE}>{translate.footerProviders}</Link>
            </div>
          </div>
          <div className="w-full flex flex-col-reverse md:flex-row md:justify-between items-center gap-[10px] md:gap-[32px]">
            <div className="w-full flex flex-col-reverse md:flex-col gap-[12px] md:gap-[32px]">
              <p className="footer-links-fonts footer_shop_address">{SHOP_ADDRESS}</p>
              <div className="flex flex-col sm:flex-row lg:hidden sm:items-center gap-[13px]">
                <p className="footer-links-fonts">{translate.footerWriteUs}:</p>

                <div className="flex gap-[10px]">
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

            <div className="w-full flex flex-col justify-between gap-[15px]">
              <div className="flex flex-col">
                <Link className="text-[14px]" href={`tel:${SHOP_PHONE}`}>
                  {SHOP_PHONE}
                </Link>
                <Link className="text-[14px]" href={`tel:${SHOP_SECOND_PHONE}`}>
                  {SHOP_SECOND_PHONE}
                </Link>
              </div>
              <div className="flex flex-col">
                <Link
                  className="footer-links-fonts text-[10px] text-black"
                  href={`mailto:${SHOP_EMAIL}`}
                >
                  {SHOP_EMAIL}
                </Link>

                <p className="hidden md:block text-[10px]">
                  {translate.footerTextUnderEmail}
                </p>
              </div>
            </div>

            <nav className="w-full hidden lg:flex items-center justify-end gap-[13px]">
              <p className="footer-links-fonts">{translate.footerWriteUs}:</p>
              <Link href={SHOP_TELEGRAM}>
                <Icons id="telegram" />
              </Link>

              <Link href={SHOP_WHATSAPP}>
                <Icons id="whatsapp" />
              </Link>

              <Link href={SHOP_INSTAGRAM}>
                <Icons id="instagram" />
              </Link>
            </nav>
          </div>
        </nav>
      </div>

      <div className="w-full container mx-auto flex justify-between items-center mb-4 px-[28px] sm:px-0">
        <p className="text-[10px]">{translate.footerUsing}</p>

        <p className="hidden sm:block">{`© ${SHOP_NAME}`}</p>
      </div>
    </footer>
  );
}
