"use client";

import React from "react";
import Image from "next/image";
import { useState } from "react";

//Components
import { Icons } from "../Icons/Icons";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { Button } from "@nextui-org/react";

//Utils
import { SHOP_ROUTE, CATALOG_ROUTE } from "@/utils/Consts";

//Hooks
import { useCart } from "@/hooks/useCart";
import { useTranslate } from "@/hooks/useTranslate";
import { useTypedSelector } from "@/hooks/useTypedSelector";

//Types
import { IProductMainPage } from "@/types/types";

//Styles
import "./ProductComponent.scss";
import { showToastMessage } from "@/app/toastsChange";

const ProductComponent = ({ oneProduct }: { oneProduct: IProductMainPage }) => {
  const { isAuth } = useTypedSelector(state => state.user);

  const [productCounter, setProductCounter] = useState<number>(1);

  const { addItemToCart } = useCart();

  const {
    mainPageRoute,
    headerCatalog,
    productPageButton,
    productPageCompound,
    productPageCountry,
    productPageDescription,
    productPageInStock,
    productPageManufacturer,
    productPagePattern,
    productPageSeason,
    productPageArticle,
    filterColor,
    messageCounterDec,
    messageCounterInc,
  } = useTranslate();

  const handleAddToCart = () => {
    addItemToCart(oneProduct, productCounter, isAuth);
    setProductCounter(1);
  };

  const mapSizesProductCard = () => {
    const sizesArray: { size: string }[] = [
      { size: "XXL" },
      { size: "XL" },
      { size: "L" },
      { size: "M" },
      { size: "S" },
    ];

    return sizesArray.map(({ size }, index) => (
      <button
        key={index}
        className="w-fit py-[5px] px-[10px]  border-1 border-border cursor-pointer hover:border-tiffani"
      >
        <p className="font-medium">{size}</p>
      </button>
    ));
  };

  const changeProductCounter = (action: "inc" | "dec") => {
    if (action === "inc") {
      if (productCounter < oneProduct.amount) {
        setProductCounter(prev => prev + 1);
      }
    } else {
      if (productCounter > 1) {
        setProductCounter(prev => prev - 1);
      }
    }

    if (action === "dec" && productCounter === 1)
      showToastMessage("warn", messageCounterDec);

    if (action === "inc" && productCounter === oneProduct.amount)
      showToastMessage("warn", `${messageCounterInc} ${productCounter}!`);
  };

  return (
    <main>
      <Breadcrumbs>
        <BreadcrumbItem href={SHOP_ROUTE}>{mainPageRoute}</BreadcrumbItem>

        <BreadcrumbItem href={CATALOG_ROUTE}>{headerCatalog}</BreadcrumbItem>

        <BreadcrumbItem>{oneProduct.name}</BreadcrumbItem>
      </Breadcrumbs>

      <div key={oneProduct.id} className="flex flex-col mt-[48px] mb-[54px]">
        <h1 className="text-[32px] font-medium mb-[24px]">{oneProduct.name}</h1>
        <div className="flex flex-col lg:flex-row gap-[21px] mb-[54px]">
          <div className="w-full lg:w-[560px] flex flex-col gap-[14px]">
            <Image
              className="w-full h-full object-cover"
              src={oneProduct.image ? oneProduct.image : ""}
              width={500}
              height={500}
              alt="rec"
            />
          </div>

          <div className="w-full flex flex-col sm:grid grid-cols-5 grid-rows-5 p-8 sm:p-[61px] border-1 border-border shadow-xl gap-[42px]">
            <div className="flex flex-col col-span-3 row-span-4 gap-[11px]">
              <div className="flex mb-[33px]">
                <p className="text-textAcc">{productPageArticle}:&nbsp;</p>
                <p className="family-medium">{oneProduct.article_number}</p>
              </div>
              <div className="flex w-full">
                <p className="text-textAcc">{productPageCompound}:&nbsp;</p>
                <p className="family-medium truncate">{oneProduct.compound}</p>
              </div>
              <div className="flex w-full">
                <p className="text-textAcc">{productPageManufacturer}:&nbsp;</p>
                <p className="family-medium truncate">
                  {oneProduct.brand.name}
                </p>
              </div>
              <div className="flex w-full">
                <p className="text-textAcc">{productPageSeason}:&nbsp;</p>
                <p className="family-medium truncate">{oneProduct.season}</p>
              </div>
              <div className="flex w-full">
                <p className="text-textAcc">{productPagePattern}:&nbsp;</p>
                <p className="family-medium truncate">{oneProduct.pattern}</p>
              </div>
              <div className="flex w-full">
                <p className="text-textAcc">{productPageCountry}:&nbsp;</p>
                <p className="family-medium truncate">
                  {oneProduct.manufacturerCountry.name}
                </p>
              </div>
              <div className="flex w-full">
                <p className="text-textAcc">{filterColor}:&nbsp;</p>
                <p className="family-medium truncate">
                  {oneProduct.color.name}
                </p>
              </div>
            </div>

            <div className="col-span-2 row-span-4">
              <p className="text-[32px] family-medium">{oneProduct.price} $</p>

              <p className="text-textAcc mb-[22px]">{productPageInStock}</p>

              <div className="flex flex-wrap gap-[10px] mb-[26px]">
                {mapSizesProductCard()}
              </div>

              <div className="flex gap-[10px] mb-[26px]">
                <button className="w-[30px] h-[30px] rounded-full drop-shadow-md bg-black border-2 border-white" />

                <button className="w-[30px] h-[30px] rounded-full drop-shadow-md bg-blue border-2 border-white" />

                <button className="w-[30px] h-[30px] rounded-full drop-shadow-md bg-white border-2 border-gray-color" />

                <button className="w-[30px] h-[30px] rounded-full drop-shadow-md bg-brown border-2 border-white" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between row-span-2 col-span-5 gap-4 sm:gap-0">
              <div className="flex">
                <button
                  onClick={() => changeProductCounter("dec")}
                  className="w-[30px] h-[30px] flex items-center justify-center cursor-pointer border-1 border-tiffani"
                >
                  <Icons id="minus" />
                </button>

                <div className="w-[40px] h-[30px] flex items-center justify-center border-t-1 border-b-1 border-tiffani">
                  <p>{productCounter}</p>
                </div>

                <button
                  onClick={() => changeProductCounter("inc")}
                  className="w-[30px] h-[30px] flex items-center justify-center cursor-pointer border-1 border-tiffani"
                >
                  <Icons id="plusMini" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-[16px]">
                <p className="text-[25px] family-medium">
                  {(productCounter * +oneProduct.price).toFixed(2)} $
                </p>

                <Button
                  onClick={handleAddToCart}
                  className="bg-tiffani text-white rounded-md w-full sm:w-[200px] h-[44px] py-[10px]"
                >
                  {productPageButton}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[24px] family-medium">{productPageDescription}</p>

        <p>{oneProduct.description}</p>
      </div>
    </main>
  );
};

export { ProductComponent };
