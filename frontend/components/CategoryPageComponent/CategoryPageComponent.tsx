"use client";

//Global
import React, { FC } from "react";

//Components
import { Filter } from "../Filter/Filter";

//Hooks
import { useTranslate } from "@/hooks/useTranslate";

//Types
import { IProductMainPage } from "@/types/types";

const CategoryPageComponent: FC<{
  products: IProductMainPage[];
}> = ({ products }) => {
  const { selectProductText } = useTranslate();

  return (
    <>
      <h5 className="text-[24px] mt-[80px] mb-[25px]">{selectProductText}</h5>

      <Filter products={products} />
    </>
  );
};

export { CategoryPageComponent };
