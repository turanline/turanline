"use client";

//Global
import { useCallback } from "react";

//Actions
import {
  setFilters,
  setCategory,
  fetchProducts,
  fetchFilteredProducts,
  setSearchText,
} from "@/redux/reducers/productsSlice";

//Hooks
import { useAppDispatch } from "./useAppDispatch";

//Types
import { IProductMainPage, IProductsState } from "@/types/types";

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

    return filtered.filter(({ name }) =>
      name.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const compareObjects = (
    obj1: IProductsState["filters"],
    obj2: IProductsState["filters"]
  ) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (
        !obj2.hasOwnProperty(key) ||
        obj1[key as keyof IProductsState["filters"]] !==
          obj2[key as keyof IProductsState["filters"]]
      ) {
        return false;
      }
    }

    return true;
  };

  return {
    onSetCategory,
    onSetFilters,
    setAllProducts,
    onSetFiltered,
    compareObjects,
    onSetSearchText,
    handleSearch,
  };
};

export { useProducts };
