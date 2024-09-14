"use client";

//Global
import React, { FC } from "react";

//Components
import { ProductCard } from "../ProductCard/productCard";

//Hooks
import { useTranslate } from "@/hooks/useTranslate";

//Types
import { IProductMainPage, IProductPageProducts } from "@/types/types";

const ProductPageProducts: FC<IProductPageProducts> = ({
  products,
  isSimilar,
}) => {
  const { productPageFamous, productPageSimilar } = useTranslate();

  const title = isSimilar ? productPageSimilar : productPageFamous;

  return (
    <>
      <h3 className="text-[32px] family-medium mb-[31px]">{title}</h3>

      <div className="single-page-wrapper flex flex-col sm:flex-row gap-[27px] mb-[27px]">
        {products.map((product: IProductMainPage) => (
          <ProductCard productInfo={product} key={product.id} />
        ))}
      </div>
    </>
  );
};

export { ProductPageProducts };
