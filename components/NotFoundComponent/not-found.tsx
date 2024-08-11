//Global
import { NextPage } from "next";
import React from "react";
import Link from "next/link";
import { CATALOG_ROUTE } from "@/utils/Consts";
import "./not-found.scss";

const ErrorPage: NextPage = () => {
  return (
    <div className="h-[358px] flex justify-center items-center flex-col gap-[40px]">
      <div className="flex flex-col gap-[20px]">
        <div className="flex flex-col items-center gap-[10px]">
          <h5 className="text-tiffani font-medium text-[14px]">
            Небольшая ошибка
          </h5>

          <span className="text-tiffani text-[40px] family-medium">404</span>
        </div>

        <p className="text-gray/500 text-[16px] w-full max-w-[640px] text-center">
          Упс... Кажется, этой страницы не существует! Перейдите на главную и
          попробуйте ещё раз.
        </p>
      </div>

      <Link
        className="w-[187px] h-[44px] flex justify-center items-center bg-tiffani text-white rounded-[5px] py-[10px] px-[20px] text-[14px]"
        href={CATALOG_ROUTE}
      >
        В каталог
      </Link>
    </div>
  );
};

export default ErrorPage;
