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

  return (
    <main className="container mx-auto mb-[30px] px-[28px] md:px-0">
      <Breadcrumbs>
        <BreadcrumbItem href={SHOP_ROUTE}>{mainPageRoute}</BreadcrumbItem>

        <BreadcrumbItem>{headerContacts}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="contacts-page_wrapper">
        <div className="flex flex-col gap-[50px]">
          <div className="w-full flex flex-col">
            <h5 className="family-medium text-tiffani">{headerContacts}</h5>

            <h3 className="family-bold text-[40px]">{SHOP_NAME}</h3>

            <p className="text-gray/500">{contactsPageText}</p>
          </div>

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
