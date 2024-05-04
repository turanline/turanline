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
  SHOP_PHONE_3,
  SHOP_ROUTE,
} from "@/utils/Consts";

//Styles
import "./contacts.scss";

export default function Contacts() {
  const {
    mainPageRoute,
    headerContacts,
    registrationLabelEmail,
    contactsPageEmailText,
    contactsPageOffice,
    contactsPageOfficeText,
    contactsPagePhone,
    contactsPagePhoneText,
    contactsPageText,
  } = useTranslate();

  const renderYandexMaps = () => {
    return (
      <YMaps>
        <div className="w-full">
          <Map
            className="w-full h-full min-h-[250px]"
            defaultState={{ center: [36.542576, 32.037462], zoom: 14 }}
          >
            <Placemark defaultGeometry={[36.542576, 32.037462]} />
          </Map>
        </div>
      </YMaps>
    );
  };

  return (
    <main className="container mx-auto mt-[30px] mb-[100px] px-[28px] md:px-0">
      <Breadcrumbs>
        <BreadcrumbItem href={SHOP_ROUTE}>{mainPageRoute}</BreadcrumbItem>
        <BreadcrumbItem>{headerContacts}</BreadcrumbItem>
      </Breadcrumbs>
      <div className="w-full mt-[48px]">
        <div className="w-full flex flex-col mb-[60px]">
          <h5 className="family-medium mb-[10px] text-tiffani">
            {headerContacts}
          </h5>
          <h1 className="family-bold text-[40px]   mb-[20px]">{SHOP_NAME}</h1>
          <p className="text-gray/500 mb-[40px]">{contactsPageText}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-[50px]">
          <div className="flex flex-col gap-[40px]">
            <div className="flex gap-[14px]">
              <Icons id="emailIcon" />
              <div className="flex flex-col">
                <p className="family-medium font-medium">
                  {registrationLabelEmail}
                </p>
                <p className="text-gray/500 text-[13px] mb-[12px]">
                  {contactsPageEmailText}
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
                  {contactsPageOffice}
                </p>
                <p className="text-gray/500 text-[13px] mb-[12px]">
                  {contactsPageOfficeText}
                </p>
                <p className="family-medium text-tiffani text-[13px]  ">
                  {SHOP_ADDRESS_2}
                </p>
              </div>
            </div>
            <div className="flex gap-[14px]">
              <Icons id="phoneIcon" />
              <div className="flex flex-col">
                <p className="family-medium font-medium">{contactsPagePhone}</p>
                <p className="text-gray/500 text-[13px] mb-[12px]">
                  {contactsPagePhoneText}
                </p>
                <Link
                  className="family-medium text-tiffani text-[13px]  "
                  href={`tel:${SHOP_PHONE_3}`}
                >
                  {SHOP_PHONE_3}
                </Link>
              </div>
            </div>
          </div>
          {renderYandexMaps()}
        </div>
      </div>
    </main>
  );
}
