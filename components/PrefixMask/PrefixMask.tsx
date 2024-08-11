"use client";
//Global
import React, { FC, useRef } from "react";
import Image from "next/image";
//Hooks
import { useTypedSelector } from "@/hooks/useReduxHooks";
//Types
import { PrefixMaskProps,Country } from "@/types/componentTypes";
//Locales
import prefixes from "@/locales/prefixes.json";
//Components
import InputMask from "react-input-mask";
import { Select, SelectItem } from "@nextui-org/react";


export const PrefixMask: FC<PrefixMaskProps> = ({ onClickFunction,properties,setSelectPhone }) => {
  const { phone_mask } = useTypedSelector(state => state.prefix);
  const selectRef = useRef<HTMLSelectElement | null>(null);

  const selectClassName = {
    innerWrapper: "w-fit h-[30px]",
    popoverContent: "w-[130px] h-[250px]",
    mainWrapper: "w-[74px] h-[50px]",
    base: "w-[74px] h-[44px]",
    trigger: "rounded-tl-[10px] rounded-bl-[10px] rounded-tr-none rounded-br-none shadow-none w-[74px] h-[44px] border border-r-0"
  };

  const renderAllPrefixes = () => {
    if (!prefixes.prefixes) return (
      <SelectItem key="+1" value="+1">
        Ошибка
      </SelectItem>
    );
  
    return (
      prefixes.prefixes?.map((country: Country) => (
        <SelectItem aria-label={`${country?.code}`} key={country?.code} value={`${country?.code}`}>
          <img src={country?.flag} alt={country?.name} className="inline-block w-4 h-4 mr-2" />
          {country?.code}
        </SelectItem>
      ))
    );
  };

  return (
    <div className="flex items-center justify-center">
     
    </div>
  );
};
