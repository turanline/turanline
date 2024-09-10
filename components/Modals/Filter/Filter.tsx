"use client";
//Global
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
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
import { useUserActions } from "@/hooks/useUserActions";
//Redux Types
import { IProductsState } from "@/types/reduxTypes";
//Services
import { getProductsByFilter } from "@/services/productsAPI";
//styles
import "./Filter.scss";
import "swiper/css/pagination";
import "swiper/css";
import { showToastMessage } from "@/app/toastsChange";

const Filter: FC = () => {
  const [value, setValue] = useState<number[]>([0, 10000]);
  const [color, setColor] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [mold,setMold] = useState<string>("");
  const [season,setSeason] = useState<string>("");
  const [material,setMaterial] = useState<string>("");
  const [category,setCategory] = useState<string>("");


  const { push } = useRouter();
  const pathname = usePathname();
  const translate = useTranslate();
  const { onSetFilters, areFiltersEqual,onSetSearchProducts,setAllProducts } = useProducts();
  const { filters, products, status,colors ,filtered} = useTypedSelector(state => state.products);
  const { categories} = useTypedSelector(state => state.categories);


  const {onGetColors} = useUserActions()



  const returnUniqueArray = (array: any[]): string[] => {
    const uniqueSet = new Set(array);
    const uniqueArray = Array.from(uniqueSet);

    return uniqueArray;
  }

  const handleSearch = async () => {
    if (pathname !== CATALOG_ROUTE) push(CATALOG_ROUTE);

    const newFilters: IProductsState["filters"] = {
      brand: brand ? brand : null,
      color: Number(color) ? Number(color) : "",
      price_max:value[1],
      price_min:value[0],
      category: Number(category) ? Number(category) : "" ,
      mold: mold ? mold : "",
      material: material ? material : "",
      season: season ? material : ""
    };


    try {
      const filteredFilters = Object.fromEntries(
        Object.entries(newFilters).filter(([key, value]) => value !== undefined && value !== null && value !== '')
      );

      const products = await getProductsByFilter(filteredFilters);
      
      if(!products?.length) return showToastMessage('warn','По текущему фильтру ничего не найдено')
      onSetSearchProducts(products)

    } catch (error) {
      console.error('Search failed:', error);
    }
  };



  const resetFilters = () => {
    const newFilters: IProductsState["filters"] = {
      brand: null,
      color: "",
      price_max:value[1],
      price_min:value[0],
      category: null,
      mold: null,
      material: null,
      season: null,
    };

    const areEqual = areFiltersEqual(newFilters, filters);

    if (!areEqual) onSetFilters(newFilters);

    setColor(prev => (prev ? "" : prev));
    setBrand(prev => (prev ? "" : prev));
    setMold(prev => (prev ? "" : prev));
    setCategory(prev => (prev ? "" : prev));
    setSeason(prev => (prev ? "" : prev));
    setMaterial(prev => (prev ? "" : prev));

  };


  const renderFilterOptions = (array: string[], value: string, setValue: Dispatch<SetStateAction<string>>, text: string) => {
    if (array?.length)
    return (
        <div className="w-full flex flex-col rounded-sm border-1 border-border py-[24px] px-[18px] filter-block_shadow">
          <h5 className="family-medium mb-[20px]">{text}</h5>

          <div className="flex flex-col gap-2">
            <RadioGroup value={value} onChange={e => setValue(e.target.value)}>
              {array?.map(uniqueColor => (
                <Radio key={uniqueColor} value={uniqueColor}>
                  {uniqueColor}
                </Radio>
              ))}
            </RadioGroup>
          </div>
        </div>
      );
  };
  const renderFilterOptionsColor = (array: any[], value: string, setValue: Dispatch<SetStateAction<string>>, text: string) => {
    if (array?.length)
    return (
        <div className="w-full flex flex-col rounded-sm border-1 border-border py-[24px] px-[18px] filter-block_shadow">
          <h5 className="family-medium mb-[20px]">{text}</h5>

          <div className="flex flex-col gap-2">
            <RadioGroup onChange={e => setValue(e.target.value)}>
              {array?.map(uniqueColor => (
                <Radio key={uniqueColor.id} value={uniqueColor.id}>
                  {uniqueColor.slug}
                </Radio>
              ))}
            </RadioGroup>
          </div>
        </div>
      );
  };
  const renderFilterOptionsCategory = (array: any[], value: string, setValue: Dispatch<SetStateAction<string>>, text: string) => {
    if (array?.length)
    return (
        <div className="w-full flex flex-col rounded-sm border-1 border-border py-[24px] px-[18px] filter-block_shadow">
          <h5 className="family-medium mb-[20px]">{text}</h5>

          <div className="flex flex-col gap-2">
            <RadioGroup onChange={e => setValue(e.target.value)}>
              {array?.map(category => (
                <Radio key={category.id} value={category.id}>
                  {category.name}
                </Radio>
              ))}
            </RadioGroup>
          </div>
        </div>
      );
  };
  
  

  const allMolds = products?.flatMap(product => product?.mold);
  const allSeasons = products?.flatMap(product => product?.season);
  const allMaterials = products?.flatMap(product => product?.material);


  const uniqueMolds = returnUniqueArray(allMolds);
  const uniqueSeasons = returnUniqueArray(allSeasons);
  const uniqueMaterial = returnUniqueArray(allMaterials).filter(Boolean);


  const sliderClassName = {
    thumb: "bg-tiffani",
    filler: "bg-tiffani",
    track: "h-[10px]",
  };

  useEffect(()=>{
    onGetColors()
  },[onGetColors])

  useEffect(() => {
    setAllProducts();
  }, [setAllProducts]);

  if (status === "pending") 
  return <Icons id="spiner" />;

  return (
    <div id="filter" className="mb-[40px]">
      <div className="rounded-sm md:border-1 border-border md:shadow-md md:px-[24px] lg:px-[65px] lg:py-[25px] md:py-[25px] sm:py-[0px] md:mb-[37px]">
        <div className="flex flex-col md:flex-row gap-[18px]">
          <div className="w-full flex flex-col gap-[16px] capitalize">
            {renderFilterOptionsColor(colors, color, setColor, translate.filterColor)}

          </div>
          <div className="w-full flex flex-col gap-[16px]">
            <div className="w-full flex flex-col rounded-sm border-1 border-border py-[24px] px-[18px] filter-block_shadow">
              <h5 className="family-medium mb-[20px]">{translate.filterPrice}</h5>

              <Slider
                label={`${translate.filterPriceText}:`}
                formatOptions={{ style: "currency", currency: "USD" }}
                step={10}
                maxValue={10000}
                minValue={0}
                value={value}
                //@ts-ignore
                onChange={setValue}
                classNames={sliderClassName}
              />

              <p className="text-default-500 font-medium text-small mt-[15px]">
                {translate.filterSelectedBudget}:{" "}
                {Array.isArray(value) && value.map(b => `$${b}`).join(" – ")}
              </p>
            </div>

            {renderFilterOptions(uniqueMolds, mold, setMold, translate.productMold)}
            {renderFilterOptionsCategory(categories, category, setCategory, translate.headerCategorySelect)}
            {renderFilterOptions(uniqueSeasons, season, setSeason, translate.productPageSeason)}
            {renderFilterOptions(uniqueMaterial, material, setMaterial, translate.materialTitle)}



            <div className="flex justify-center gap-[25px]">
              <Button
                onClick={handleSearch}
                className="w-full md:w-full md:max-w-[270px] h-[44px] bg-tiffani text-white"
                radius="sm"
              >
                {translate.filterShow}
              </Button>

              <Button
                onClick={resetFilters}
                className="w-full md:w-full md:max-w-[270px] h-[44px] bg-transparent text-tiffani"
                radius="sm"
              >
                {translate.filterReset}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Filter };
