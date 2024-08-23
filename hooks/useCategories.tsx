"use client";
//Global
import { useState } from "react";
import Link from "next/link";
import { useCallback } from "react";
//Actions
import {
  fetchCategories,
  fetchTypes,
  fetchSubtypes,
} from "@/redux/reducers/categoriesSlice";
//Hooks
import { useAppDispatch, useTypedSelector } from "./useReduxHooks";
//Types
import { ICurrentCategory } from "@/types/componentTypes";
//Styles
import "@/components/Header/Header.scss";

const useCategories = (color: string) => {
  //Hooks
  const { status, categories, types, subtypes } = useTypedSelector(
    (state) => state.categories
  );
  const { selectedLanguage } = useTypedSelector((state) => state.language);
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<ICurrentCategory>({
    id: 0,
    name: "",
  });

  const filterByProperty = <T, K extends keyof T>(
    items: T[],
    property: K,
    value: T[K]
  ) => items.filter((item) => item[property] === value);

  const returnTypesByCategory = (id: number) =>
    filterByProperty(types, "parent", id);

  const returnSubtypesByType = (id: number) =>
    filterByProperty(subtypes, "parent", id);

  const onSetSubtypes = useCallback(
    () => dispatch(fetchSubtypes()),
    [dispatch]
  );

  const onSetTypes = useCallback(() => dispatch(fetchTypes()), [dispatch]);

  const onSetCategories = useCallback(
    () => dispatch(fetchCategories()),
    [dispatch, selectedLanguage]
  );

  const renderDesktopCategories = () =>
    categories?.map((category) => (
      <Link
        onMouseEnter={() => {
          setCurrentCategory(category);
          setIsOpen(true);
        }}
        key={category?.id}
        href={`/category/${category?.id}`}
      >
        {category?.name}
      </Link>
    ));

  const renderTypesByCategory = () => {
    if (!isOpen) return;

    return (
      <div className="w-full container flex gap-[50px] justify-between flex-wrap text-white">
        {returnTypesByCategory(currentCategory.id).map((type) => (
          <div key={type.id} className="flex flex-col gap-[10px]">
            <Link className="font-bold" href={`/category/${type.parent}`}>
              {type.name}
            </Link>

            <div className="flex flex-col gap-[5px]">
              {returnSubtypesByType(type.id).map((subtype) => (
                <Link key={subtype.id} href={`/category/${type.parent}`}>
                  {subtype.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const mapCategoriesOnDesktop = () => {
    if (status === "fulfilled")
      return (
        <nav
          onMouseLeave={() => setIsOpen(false)}
          className="header-block flex flex-col justify-center items-center gap-[15px]"
          style={{
            backgroundColor: color,
            padding: "15px 0",
          }}
        >
          <div className="w-full container px-[15px] flex justify-between text-white">
            {renderDesktopCategories()}
          </div>

          {renderTypesByCategory()}
        </nav>
      );
  };

  const mapCategoriesOnPhone = () => {
    if (status === "fulfilled")
      return (
        <div className="flex flex-col max-sm:basis-[50%] gap-[20px] row-span-4">
          {categories?.map((category) => (
            <Link key={category?.id} href={`/category/${category?.id}`}>
              {category?.name}
            </Link>
          ))}
        </div>
      );
  };

  return {
    onSetCategories,
    mapCategoriesOnDesktop,
    mapCategoriesOnPhone,
    onSetTypes,
    onSetSubtypes,
    returnSubtypesByType,
    returnTypesByCategory,
  };
};

export { useCategories };
