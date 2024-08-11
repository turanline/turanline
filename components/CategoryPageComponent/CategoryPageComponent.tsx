"use client";

//Global
import React, { FC } from "react";

//Components
import { Filter } from "../Modals/Filter/Filter";

//Hooks
import { useTranslate } from "@/hooks/useTranslate";

const CategoryPageComponent: FC = () => {
  const { selectProductText } = useTranslate();

  return (
    <>
      <h5 className="text-[24px] mt-[80px] mb-[25px]">{selectProductText}</h5>

      <Filter />
    </>
  );
};

export { CategoryPageComponent };
