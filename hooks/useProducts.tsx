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
import { Color, IProductMainPage } from "@/types/componentTypes";
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

// Function for comparing two filter objects for identity
const areFiltersEqual = ( filters1: IProductsState["filters"], filters2: IProductsState["filters"]): boolean => {
  const filterKeys1 = Object.keys(filters1);
  const filterKeys2 = Object.keys(filters2);

  // Check that the number of keys matches
  if (filterKeys1.length !== filterKeys2.length) return false;

  // Check the identity of values by keys in both objects
  return filterKeys1.every(
    key =>
      filters2.hasOwnProperty(key) &&
      filters1[key as keyof IProductsState["filters"]] === filters2[key as keyof IProductsState["filters"]]
  );
};

// Function for obtaining styles for color selection buttons
const getColorButtonStyles = (colorOption: Color, selectedColorId: number): CSSProperties => {
  const isSelected = colorOption?.id === selectedColorId;

  return {
    borderColor: isSelected ? "#0abab5" : "",
    background: colorOption?.color || "transparent",
  };
};

// Handling a click on the color selection button
const handleColorSelection = ( colorOptionId: number, selectedColorId: number, setSelectedColorId: Dispatch<SetStateAction<number>> ) => {
  if (colorOptionId !== selectedColorId) {
    setSelectedColorId(colorOptionId);
  } else {
    setSelectedColorId(0); // Resets the selection if the same color is selected again
  }
};

// Product options rendering function 
const renderColorOptions = (
  colors: IProductMainPage["colors_data"],
  selectedColorId: number,
  setSelectedColorId: Dispatch<SetStateAction<number>>,
  buttonClassName: string
) => {
  if (!colors?.length) return null;

  return (
    <div className="flex flex-wrap gap-[10px]">
      {colors?.map((colorOption, index) => (
        <button
          key={index}
          onClick={() => handleColorSelection(colorOption?.id, selectedColorId, setSelectedColorId)}
          className={buttonClassName}
          style={getColorButtonStyles(colorOption, selectedColorId)}
        />
      ))}
    </div>
  );
};


  return {
    onSetCategory,
    onSetFilters,
    setAllProducts,
    onSetFiltered,
    areFiltersEqual,
    onSetSearchText,
    handleSearch,
    renderColorOptions,
  };
};

export { useProducts };
