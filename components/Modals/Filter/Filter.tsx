"use client";
//Global
import { Dispatch, FC, SetStateAction, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
//Components
import { Slider, Button, RadioGroup, Radio } from "@nextui-org/react";
import { Icons } from "@/components/Icons/Icons";
//Utils
import { CATALOG_ROUTE } from "@/utils/Consts";
//Hooks
import { useTypedSelector } from "@/hooks/useReduxHooks";
import { useProducts } from "@/hooks/useProducts";
import { useTranslate } from "@/hooks/useTranslate";
//Redux Types
import { IProductsState } from "@/types/reduxTypes";
//styles
import "./Filter.scss";
import "swiper/css/pagination";
import "swiper/css";

const Filter: FC = () => {
  const [value, setValue] = useState<number[]>([2000, 8000]);
  const [color, setColor] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [brand, setBrand] = useState<string>("");

  const { push } = useRouter();
  const pathname = usePathname();
  const { filters, products, status } = useTypedSelector(state => state.products);
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

  const renderFilterOptions = (array: string[], value: string, setValue: Dispatch<SetStateAction<string>>, text: string) => {
    if (array?.length)
    return (
        <div className="w-full flex flex-col rounded-sm border-1 border-border py-[24px] px-[18px] filter-block_shadow">
          <h5 className="family-medium mb-[20px]">{text}</h5>

          <div className="flex flex-col gap-2">
            <RadioGroup value={value} onChange={e => setValue(e.target.value)}>
              {array.map(uniqueColor => (
                <Radio key={uniqueColor} value={uniqueColor}>
                  {uniqueColor}
                </Radio>
              ))}
            </RadioGroup>
          </div>
        </div>
      );
  };

  const allBrands = products?.flatMap(product => product?.brand?.name),
    allColors = products?.flatMap(product =>
      product?.colors_data?.map(c => c?.slug)
    );

  const allSizes = products?.flatMap(product =>
    product?.sizes_data?.map(s => s?.name)
  );

  const uniqueColors = returnUniqueArray(allColors),
    uniqueBrands = returnUniqueArray(allBrands),
    uniqueSizes = returnUniqueArray(allSizes);

  const sliderClassName = {
    thumb: "bg-tiffani",
    filler: "bg-tiffani",
    track: "h-[10px]",
  };

  if (status === "pending") return <Icons id="spiner" />;

  return (
    <div id="filter" className="mb-[40px]">
      <div className="rounded-sm md:border-1 border-border md:shadow-md md:px-[24px] lg:px-[65px] lg:py-[25px] md:py-[25px] sm:py-[0px] md:mb-[37px]">
        <div className="flex flex-col md:flex-row gap-[18px]">
          <div className="w-full flex flex-col gap-[16px] capitalize">
            {renderFilterOptions(uniqueColors, color, setColor, filterColor)}

            {renderFilterOptions(uniqueSizes, size, setSize, filterSize)}
          </div>
          <div className="w-full flex flex-col gap-[16px]">
            <div className="w-full flex flex-col rounded-sm border-1 border-border py-[24px] px-[18px] filter-block_shadow">
              <h5 className="family-medium mb-[20px]">{filterPrice}</h5>

              <Slider
                label={`${filterPriceText}:`}
                formatOptions={{ style: "currency", currency: "USD" }}
                step={100}
                maxValue={10000}
                minValue={0}
                value={value}
                //@ts-ignore
                onChange={setValue}
                classNames={sliderClassName}
              />

              <p className="text-default-500 font-medium text-small mt-[15px]">
                {filterSelectedBudget}:{" "}
                {Array.isArray(value) && value.map(b => `$${b}`).join(" – ")}
              </p>
            </div>

            {renderFilterOptions(uniqueBrands, brand, setBrand, filterBrand)}

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
