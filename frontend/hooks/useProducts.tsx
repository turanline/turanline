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
import { useAppDispatch } from "./useReduxHooks";

//Component Types
import { IProductMainPage } from "@/types/componentTypes";

//Redux Types
import { IProductsState } from "@/types/reduxTypes";

const useProducts = () => {
  const dispatch = useAppDispatch();

  const onSetFilters = useCallback(
    (newFilters: IProductsState["filters"]) => dispatch(setFilters(newFilters)),
    [dispatch]
  );

  const onSetCategory = useCallback(
    (newCategory: string) => dispatch(setCategory(newCategory)),
    [dispatch]
  );

  const setAllProducts = useCallback(
    () => dispatch(fetchProducts()),
    [dispatch]
  );

  const onSetFiltered = useCallback(
    () => dispatch(fetchFilteredProducts()),
    [dispatch]
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

  const mapProductOptions = (
    options: IProductMainPage["size" | "color"],
    selectedOption: number,
    setSelectedOption: Dispatch<SetStateAction<number>>,
    className: string,
    isColor: boolean = false
  ) => {
    const returnButtonStyles = (item: { id: number }): CSSProperties => ({
      borderColor: `${item.id === selectedOption ? "#0abab5" : ""}`,
      background:
        isColor && "color" in item ? (item?.color as string) : "transparent",
    });

    const handleClickButton = (item: { id: number }) => {
      if (item.id !== selectedOption) {
        setSelectedOption(item.id);
        return;
      }

      setSelectedOption(0);
    };

    return options?.map((item, index) => (
      <button
        onClick={() => handleClickButton(item)}
        key={index}
        className={className}
        style={returnButtonStyles(item)}
      >
        {!isColor && item.name}
      </button>
    ));
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
