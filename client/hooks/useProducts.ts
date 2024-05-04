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

  const onSetFilters = (newFilters: IProductsState["filters"]) =>
    dispatch(setFilters(newFilters));

  const onSetCategory = (newCategory: string) =>
    dispatch(setCategory(newCategory));

  const setAllProducts = () => dispatch(fetchProducts());

  const onSetFiltered = () => dispatch(fetchFilteredProducts());

  const onSetSearchText = (text: string) => dispatch(setSearchText(text));

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
