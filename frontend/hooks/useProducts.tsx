"use client";

//Global
import { CSSProperties, Dispatch, SetStateAction, useCallback } from "react";

//Actions
import {
  setFilters,
  setCategory,
  fetchProducts,
  fetchFilteredProducts,
  setSearchText,
} from "@/redux/reducers/productsSlice";

//Hooks
import { useAppDispatch, useTypedSelector } from "./useReduxHooks";

//Component Types
import { Color, IProductMainPage, Size } from "@/types/componentTypes";

//Redux Types
import { IProductsState } from "@/types/reduxTypes";

const useProducts = () => {
  const { selectedLanguage } = useTypedSelector(state => state.language);

  const dispatch = useAppDispatch();

  const onSetFilters = useCallback(
    (newFilters: IProductsState["filters"]) => dispatch(setFilters(newFilters)),
    [dispatch]
  );

  const onSetCategory = useCallback(
    (newCategory: string) => dispatch(setCategory(newCategory)),
    [dispatch, selectedLanguage]
  );

  const setAllProducts = useCallback(
    () => dispatch(fetchProducts()),
    [dispatch, selectedLanguage]
  );

  const onSetFiltered = useCallback(
    () => dispatch(fetchFilteredProducts()),
    [dispatch, selectedLanguage]
  );

  const onSetSearchText = useCallback(
    (text: string) => dispatch(setSearchText(text)),
    [dispatch]
  );

  const handleSearch = (searchText: string, filtered: IProductMainPage[]) => {
    if (!searchText) return filtered;

    const lowercasedSearchText = searchText.toLowerCase();
    return filtered.filter(({ name }) =>
      name.toLowerCase().includes(lowercasedSearchText)
    );
  };

  const compareObjects = (
    obj1: IProductsState["filters"],
    obj2: IProductsState["filters"]
  ) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    return (
      keys1.length === keys2.length &&
      keys1.every(
        key =>
          obj2.hasOwnProperty(key) &&
          obj1[key as keyof IProductsState["filters"]] ===
            obj2[key as keyof IProductsState["filters"]]
      )
    );
  };

  const getButtonStyles = (
    item: Size | Color,
    selectedOption: number,
    isColor: boolean
  ): CSSProperties => {
    const isSelected = isColor
      ? (item as Color).id === selectedOption
      : (item as Size).id === selectedOption;

    return {
      borderColor: isSelected ? "#0abab5" : "",
      background:
        isColor && "color" in item ? (item as Color).color : "transparent",
    };
  };

  const handleButtonClick = (
    item: Size | Color,
    selectedOption: number,
    setSelectedOption: Dispatch<SetStateAction<number>>,
    isColor: boolean
  ) => {
    const optionId = isColor ? (item as Color).id : (item as Size).id;
    if (optionId !== selectedOption) setSelectedOption(optionId);
    else setSelectedOption(0);
  };

  const mapProductOptions = (
    options: IProductMainPage["sizes_data"] | IProductMainPage["colors_data"],
    selectedOption: number,
    setSelectedOption: Dispatch<SetStateAction<number>>,
    className: string,
    isColor: boolean = false
  ) => {
    if (options.length)
      return (
        <div className="flex flex-wrap gap-[10px]">
          {options?.map((item, index) => (
            <button
              onClick={() =>
                handleButtonClick(
                  item,
                  selectedOption,
                  setSelectedOption,
                  isColor
                )
              }
              key={index}
              className={className}
              style={getButtonStyles(item, selectedOption, isColor)}
            >
              {!isColor && (item as Size).name}
            </button>
          ))}
        </div>
      );
  };

  return {
    onSetCategory,
    onSetFilters,
    setAllProducts,
    onSetFiltered,
    compareObjects,
    onSetSearchText,
    handleSearch,
    mapProductOptions,
  };
};

export { useProducts };
