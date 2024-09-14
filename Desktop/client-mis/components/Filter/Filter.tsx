"use client";

//Global
import { FC, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

//Components
import { Slider, Button, RadioGroup, Radio } from "@nextui-org/react";

//Utils
import { CATALOG_ROUTE } from "@/utils/Consts";

//Hooks
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useProducts } from "@/hooks/useProducts";
import { useTranslate } from "@/hooks/useTranslate";

//Types
import { IProductsState } from "@/types/types";

//styles
import "swiper/css/pagination";
import "./Filter.scss";
import "swiper/css";

const Filter: FC<{ products: IProductsState["products"] }> = ({ products }) => {
  const [value, setValue] = useState<number[]>([200, 1500]);

  const [color, setColor] = useState<string>(""),
    [size, setSize] = useState<string>(""),
    [brand, setBrand] = useState<string>("");

  const { push } = useRouter(),
    pathname = usePathname();

  const { filters } = useTypedSelector(state => state.products);

  const { onSetFilters, compareObjects } = useProducts();

  const {
    filterBrand,
    filterColor,
    filterPrice,
    filterSize,
    filterPriceText,
    filterSelectedBudget,
    filterReset,
    filterShow,
  } = useTranslate();

  function returnUniqueArray(array: string[]): string[] {
    const uniqueSet = new Set(array),
      uniqueArray = Array.from(uniqueSet);

    return uniqueArray;
  }

  const handleSearch = () => {
    if (pathname !== CATALOG_ROUTE) push(CATALOG_ROUTE);

    const newFilters: IProductsState["filters"] = {
      brand: brand ? brand : null,
      color: color ? color : null,
      size: size ? size : null,
      lbprice: value[0],
      hbprice: value[1],
    };

    const areEqual = compareObjects(newFilters, filters);

    if (!areEqual) onSetFilters(newFilters);
  };

  const resetFilters = () => {
    const newFilters: IProductsState["filters"] = {
      brand: null,
      color: null,
      size: null,
      lbprice: null,
      hbprice: null,
    };

    const areEqual = compareObjects(newFilters, filters);

    if (!areEqual) onSetFilters(newFilters);

    setColor(prev => (prev ? "" : prev));
    setBrand(prev => (prev ? "" : prev));
    setSize(prev => (prev ? "" : prev));
  };

  const allColors = products.map(product => product.color.name),
    allBrands = products.map(product => product.brand.name),
    allSizes = products.map(product => product.size.name);

  const uniqueColors = returnUniqueArray(allColors),
    uniqueBrands = returnUniqueArray(allBrands),
    uniqueSizes = returnUniqueArray(allSizes);

  return (
    <div id="filter" className="mb-[40px]">
      <div className="rounded-sm md:border-1 border-border md:shadow-md py-[25px] md:px-[24px] lg:px-[65px] md:mb-[37px]">
        <div className="flex flex-col md:flex-row gap-[18px]">
          <div className="w-full flex flex-col gap-[16px]">
            <div className="w-full flex flex-col rounded-sm border-1 border-border py-[24px] px-[18px]">
              <h5 className="family-medium mb-[20px]">{filterColor}</h5>

              <div className="flex flex-col gap-2">
                <RadioGroup
                  value={color}
                  onChange={e => setColor(e.target.value)}
                >
                  {uniqueColors.map(uniqueColor => (
                    <Radio key={uniqueColor} value={uniqueColor}>
                      {uniqueColor}
                    </Radio>
                  ))}
                </RadioGroup>
              </div>
            </div>

            <div className="w-full flex flex-col rounded-sm border-1 border-border py-[24px] px-[18px]">
              <h5 className="family-medium mb-[20px]">{filterSize}</h5>

              <div className="flex flex-col gap-2">
                <RadioGroup
                  value={size}
                  onChange={e => setSize(e.target.value)}
                >
                  {uniqueSizes.map(uniqueSize => (
                    <Radio key={uniqueSize} value={uniqueSize}>
                      {uniqueSize}
                    </Radio>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-[16px]">
            <div className="w-full flex flex-col rounded-sm border-1 border-border py-[24px] px-[18px]">
              <h5 className="family-medium mb-[20px]">{filterPrice}</h5>

              <Slider
                label={`${filterPriceText}:`}
                formatOptions={{ style: "currency", currency: "USD" }}
                step={100}
                maxValue={2000}
                minValue={100}
                value={value}
                //@ts-ignore
                onChange={setValue}
                className="max-w-md"
                classNames={{
                  thumb: "bg-tiffani",
                  filler: "bg-tiffani",
                  track: "h-[10px]",
                }}
              />

              <p className="text-default-500 font-medium text-small mt-[15px]">
                {filterSelectedBudget}:{" "}
                {Array.isArray(value) && value.map(b => `$${b}`).join(" – ")}
              </p>
            </div>

            <div className="w-full flex flex-col rounded-sm border-1 border-border py-[24px] px-[18px]">
              <h5 className="family-medium mb-[20px]">{filterBrand}</h5>

              <div className="flex flex-col gap-2">
                <RadioGroup
                  value={brand}
                  onChange={e => setBrand(e.target.value)}
                >
                  {uniqueBrands.map(uniqueBrand => (
                    <Radio key={uniqueBrand} value={uniqueBrand}>
                      {uniqueBrand}
                    </Radio>
                  ))}
                </RadioGroup>
              </div>
            </div>

            <div className="flex justify-center gap-[25px]">
              <Button
                onClick={handleSearch}
                className="w-full md:w-[270px] h-[44px] bg-tiffani text-white"
                radius="sm"
              >
                {filterShow}
              </Button>

              <Button
                onClick={resetFilters}
                className="w-full md:w-[270px] h-[44px] bg-transparent text-tiffani"
                radius="sm"
              >
                {filterReset}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Filter };
