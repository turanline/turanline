"use client";

//Global
import React, { FC } from "react";

//Components
import { ProductCard } from "../ProductCard/productCard";

//Hooks
import { useTranslate } from "@/hooks/useTranslate";

//Component Types
import { IProductMainPage } from "@/types/componentTypes";

//Component Types
import { IProductPageProducts } from "@/types/componentTypes";

const ProductPageProducts: FC<IProductPageProducts> = ({
  products,
  isSimilar,
}) => {
  const { productPageFamous, productPageSimilar } = useTranslate();

  const title = isSimilar ? productPageSimilar : productPageFamous;

  const renderProducts = () =>
    products.map((product: IProductMainPage) => (
      <ProductCard productInfo={product} key={product.id} />
    ));

  return (
    <>
      <h3 className="text-[32px] family-medium mb-[31px]">{title}</h3>

      <div className="single-page-wrapper flex flex-col sm:flex-row gap-[27px] mb-[27px]">
        {renderProducts()}
      </div>
    </>
  );
};

export { ProductPageProducts };
