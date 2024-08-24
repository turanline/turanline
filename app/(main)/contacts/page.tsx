"use client";
//Global
import Link from "next/link";
//Components
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { Icons } from "@/components/Icons/Icons";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
//Hooks
import { useTranslate } from "@/hooks/useTranslate";
//Utils
import {
  SHOP_ADDRESS_2,
  SHOP_EMAIL,
  SHOP_NAME,
  SHOP_PHONE,
  SHOP_ROUTE,
} from "@/utils/Consts";
//Styles
import "./contacts.scss";

export default function Contacts() {
  const translate = useTranslate();

  return (
    <main className="container mx-auto mb-[30px] px-[15px] lg:px-[30px]">
      <Breadcrumbs>
        <BreadcrumbItem href={SHOP_ROUTE}>{translate.mainPageRoute}</BreadcrumbItem>

        <BreadcrumbItem>{translate.headerContacts}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="contacts-page_wrapper">
        <div className="flex flex-col gap-[50px]">
          <div className="w-full flex flex-col">
            <h5 className="family-medium text-tiffani">{translate.headerContacts}</h5>

            <h3 className="family-bold text-[40px]">{SHOP_NAME}</h3>

            <p className="text-gray/500">{translate.contactsPageText}</p>
          </div>

          <div className="flex flex-col gap-[40px]">
            <div className="flex gap-[14px]">
              <Icons id="emailIcon" />

              <div className="flex flex-col">
                <p className="family-medium font-medium">
                  {translate.registrationLabelEmail}
                </p>

                <p className="text-gray/500 text-[13px] mb-[12px]">
                  {translate.contactsPageEmailText}
                </p>

                <Link
                  className="family-medium text-tiffani text-[13px]  "
                  href="mailto:mis.express@mail.ru"
                >
                  {SHOP_EMAIL}
                </Link>
              </div>
            </div>

            <div className="flex gap-[14px]">
              <Icons id="address2" />

              <div className="flex flex-col">
                <p className="family-medium font-medium">
                  {translate.contactsPageOffice}
                </p>

                <p className="text-gray/500 text-[13px] mb-[12px]">
                  {translate.contactsPageOfficeText}
                </p>

                <p className="family-medium text-tiffani text-[13px]  ">
                  {SHOP_ADDRESS_2}
                </p>
              </div>
            </div>

            <div className="flex gap-[14px]">
              <Icons id="phoneIcon" />

              <div className="flex flex-col">
                <p className="family-medium font-medium">{translate.contactsPagePhone}</p>

                <p className="text-gray/500 text-[13px] mb-[12px]">
                  {translate.contactsPagePhoneText}
                </p>

                <Link
                  className="family-medium text-tiffani text-[13px]  "
                  href={`tel:${SHOP_PHONE}`}
                >
                  {SHOP_PHONE}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <YMaps>
          <Map
            className="yandex-map"
            defaultState={{ center: [36.542576, 32.037462], zoom: 14 }}
          >
            <Placemark defaultGeometry={[36.542576, 32.037462]} />
          </Map>
        </YMaps>
      </div>
    </main>
  );
}
