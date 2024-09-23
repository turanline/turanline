"use client";
// Global
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
// Components
import { Slider, Button, Checkbox, CheckboxGroup } from "@nextui-org/react";
import { Icons } from "@/components/Icons/Icons";

// Utils
import { CATALOG_ROUTE } from "@/utils/Consts";
// Hooks
import { useTypedSelector } from "@/hooks/useReduxHooks";
import { useProducts } from "@/hooks/useProducts";
import { useTranslate } from "@/hooks/useTranslate";
import { useUserActions } from "@/hooks/useUserActions";
// Redux Types
import { IProductsState } from "@/types/reduxTypes";
// Services
import { getProductsByFilter } from "@/services/productsAPI";
// Styles
import "./Filter.scss";
import "swiper/css/pagination";
import "swiper/css";
import { showToastMessage } from "@/app/toastsChange";

const Filter: FC = () => {
  const [value, setValue] = useState<number[]>([0, 10000]);
  const [colors, setColors] = useState<string[]>([]); // Массив для цветов
  const [brands, setBrands] = useState<string[]>([]); // Массив для брендов
  const [molds, setMolds] = useState<string[]>([]); // Массив для формы
  const [seasons, setSeasons] = useState<string[]>([]); // Массив для сезонов
  const [materials, setMaterials] = useState<string[]>([]); // Массив для материалов

  const { push } = useRouter();
  const pathname = usePathname();
  const translate = useTranslate();
  const { onSetFilters, areFiltersEqual, onSetSearchProducts, setAllProducts } = useProducts();
  const { filters, products, status, colors: availableColors } = useTypedSelector((state) => state.products);

  const { onGetColors } = useUserActions();

  const returnUniqueArray = (array: any[]): string[] => {
    const uniqueSet = new Set(array);
    const uniqueArray = Array.from(uniqueSet);
    return uniqueArray;
  };

  const handleSearch = async () => {
    if (pathname !== CATALOG_ROUTE) push(CATALOG_ROUTE);
  
    // Подготовка фильтров
    const newFilters: IProductsState["filters"] = {
      brand: brands.length ? brands : null,
      color: colors.length ? colors : null,
      price_max: value[1],
      price_min: value[0],
      mold: molds.length ? molds : null,
      material: materials.length ? materials : null,
      season: seasons.length ? seasons : null,
    };
  
    try {
      // Оставляем только те фильтры, которые не пусты
      const filteredFilters = Object.fromEntries(
        Object.entries(newFilters).filter(([key, value]) => value !== undefined && value !== null)
      );
  
      // Формируем строку запроса
      const queryParams = new URLSearchParams();
      for (const [key, value] of Object.entries(filteredFilters)) {
        if (Array.isArray(value)) {
          value.forEach(val => queryParams.append(key, val));
        } else {
            if(value !==null)
            queryParams.append(key, value.toString());
        }
      }
  
  
      // Отправка запроса с подготовленными параметрами
      const response = await getProductsByFilter(queryParams.toString());
      
      if (!response?.length) return showToastMessage("warn", "По текущему фильтру ничего не найдено");
      onSetSearchProducts(response);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };
  
  

  const resetFilters = () => {
    setColors([]);
    setBrands([]);
    setMolds([]);
    setSeasons([]);
    setMaterials([]);
    setValue([0, 10000]);
  };

  const renderFilterOptions = (
    array: string[],
    selectedValues: string[],
    setValues: Dispatch<SetStateAction<string[]>>,
    text: string
  ) => {
    if (array?.length)
      return (
        <div className="w-full flex flex-col rounded-sm border-1 border-border py-[24px] px-[18px] filter-block_shadow">
          <h5 className="family-medium mb-[20px]">{text}</h5>

          <div className="flex flex-col gap-2">
            <CheckboxGroup value={selectedValues} onChange={setValues}>
              {array?.map((option) => (
                <Checkbox key={option} value={option}>
                  {option}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </div>
        </div>
      );
  };

  const renderFilterOptionsColor = (
    array: { id: number; name: string }[], // Убедитесь, что array содержит объекты с id и name
    value: string[], // Массив id выбранных цветов
    setValue: Dispatch<SetStateAction<string[]>>, // Функция для обновления выбранных цветов
    text: string // Текст заголовка
  ) => {
    if (array?.length)
      return (
        <div className="w-full flex flex-col rounded-sm border-1 border-border py-[24px] px-[18px] filter-block_shadow">
          <h5 className="family-medium mb-[20px]">{text}</h5>
  
          <div className="flex flex-col gap-2">
            <CheckboxGroup
              value={value}
              onChange={(selectedValues) => setValue(selectedValues as string[])} // Обновляем выбранные значения
            >
              {array?.map(option => (
                <Checkbox key={option.id} value={option.id.toString()}>
                  {option.name}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </div>
        </div>
      );
  };
  

  useEffect(() => {
    onGetColors();
  }, [onGetColors]);

  useEffect(() => {
    setAllProducts();
  }, [setAllProducts]);

  if (status === "pending") return <Icons id="spiner" />;

  const allMolds = products?.flatMap((product) => product?.mold);
  const allSeasons = products?.flatMap((product) => product?.season);
  const allMaterials = products?.flatMap((product) => product?.material);

  const uniqueMolds = returnUniqueArray(allMolds);
  const uniqueSeasons = returnUniqueArray(allSeasons);
  const uniqueMaterials = returnUniqueArray(allMaterials).filter(Boolean);

  return (
    <div id="filter" className="mb-[40px]">
      <div className="rounded-sm md:border-1 border-border md:shadow-md md:px-[24px] lg:px-[65px] lg:py-[25px] md:py-[25px] sm:py-[0px] md:mb-[37px]">
        <div className="flex flex-col md:flex-row gap-[18px]">
          <div className="w-full flex flex-col gap-[16px] capitalize">
            {renderFilterOptionsColor(
              availableColors,
              colors,
              setColors,
              translate.filterColor
            )}
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
                classNames={{
                  thumb: "bg-black",
                  filler: "bg-black",
                  track: "h-[10px]",
                }}
              />

              <p className="text-default-500 font-medium text-small mt-[15px]">
                {translate.filterSelectedBudget}: {Array.isArray(value) && value.map((b) => `$${b}`).join(" – ")}
              </p>
            </div>

            {renderFilterOptions(uniqueMolds, molds, setMolds, translate.productMold)}
            {renderFilterOptions(uniqueSeasons, seasons, setSeasons, translate.productPageSeason)}
            {renderFilterOptions(uniqueMaterials, materials, setMaterials, translate.materialTitle)}

            <div className="flex justify-center gap-[25px]">
              <Button onClick={handleSearch} className="showFiltter w-full md:w-full md:max-w-[270px] h-[44px] text-white" radius="sm">
                {translate.filterShow}
              </Button>

              <Button onClick={resetFilters} className="w-full md:w-full md:max-w-[270px] h-[44px] bg-transparent text-black" radius="sm">
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
