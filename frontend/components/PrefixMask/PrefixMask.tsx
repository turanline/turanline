"use client";

//Global
import React, { FC, useRef } from "react";
import Image from "next/image";

//Hooks
import { useTypedSelector } from "@/hooks/useReduxHooks";

//Types
import { PrefixMaskProps } from "@/types/componentTypes";

//Locales
import prefixes from "@/locales/prefixes.json";

//Components
import InputMask from "react-input-mask";
import { Select, SelectItem } from "@nextui-org/react";

export const PrefixMask: FC<PrefixMaskProps> = ({
  onClickFunction,
  properties,
}) => {
  const { flag, name, phone_mask } = useTypedSelector(state => state.prefix);

  const selectRef = useRef<HTMLSelectElement | null>(null);

  const { prefixes: array } = prefixes;

  const selectClassNames = {
    trigger: "h-[44px] prefixes",
    mainWrapper: "h-[44px]",
    base: "w-[175px] h-[44px]",
  };

  return (
    <div className="flex items-center justify-center">
      <Select
        ref={selectRef}
        radius="none"
        disallowEmptySelection
        defaultSelectedKeys={["+7"]}
        startContent={<Image src={flag} alt={name} width={20} height={20} />}
        classNames={selectClassNames}
      >
        {array.map(item => (
          <SelectItem
            onClick={() => onClickFunction(item)}
            key={item.code}
            startContent={
              <Image
                src={String(item.flag)}
                alt={item.name}
                width={20}
                height={20}
              />
            }
          >
            {item.code}
          </SelectItem>
        ))}
      </Select>

      <InputMask
        {...properties("phone_number")}
        data-phone
        className="form-content_bottom-label-input"
        mask={phone_mask}
        alwaysShowMask={true}
      />
    </div>
  );
};
