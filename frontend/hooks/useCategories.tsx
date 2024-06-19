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
import { useAppDispatch } from "./useAppDispatch";
import { useTypedSelector } from "./useTypedSelector";

//Styles
import "@/components/Header/Header.scss";

const useCategories = (color: string) => {
  const { status, categories, types, subtypes } = useTypedSelector(
    state => state.categories
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [currentCategory, setCurrentCategory] = useState<{
    id: number;
    name: string;
  }>({
    id: 0,
    name: "",
  });

  const dispatch = useAppDispatch();

  const filterByProperty = <T, K extends keyof T>(
    items: T[],
    property: K,
    value: T[K]
  ) => items.filter(item => item[property] === value);

  const returnTypesByCategory = (id: number) =>
    filterByProperty(types, "category", id);

  const returnSubtypesByType = (id: number) =>
    filterByProperty(subtypes, "type", id);

  const onSetSubtypes = useCallback(
    () => dispatch(fetchSubtypes()),
    [dispatch]
  );

  const onSetTypes = useCallback(() => dispatch(fetchTypes()), [dispatch]);

  const onSetCategories = useCallback(
    () => dispatch(fetchCategories()),
    [dispatch]
  );

  const mapCategoriesOnDesktop = () => {
    if (status === "fulfilled")
      return (
        <nav
          onMouseLeave={() => setIsOpen(false)}
          style={{
            height: isOpen ? "140px" : "63px",
            backgroundColor: color,
          }}
          className="header-block flex flex-col justify-center items-center gap-[15px]"
        >
          <div className="w-full container flex justify-between text-white">
            {categories.map(category => (
              <Link
                onMouseEnter={() => {
                  setCurrentCategory(category);
                  setIsOpen(true);
                }}
                key={category.id}
                href={`/category/${category.id}`}
              >
                {category.name}
              </Link>
            ))}
          </div>

          {isOpen && (
            <div
              style={{
                height: isOpen ? "60px" : "0",
              }}
              className="w-full container flex justify-between text-white"
            >
              {returnTypesByCategory(currentCategory.id).map(type => (
                <div key={type.id} className="flex flex-col gap-[10px]">
                  <Link
                    className="font-bold"
                    href={`/category/${type.category}`}
                  >
                    {type.name}
                  </Link>

                  <div className="flex flex-col gap-[5px]">
                    {returnSubtypesByType(type.id).map(subtype => (
                      <Link
                        key={subtype.id}
                        href={`/category/${type.category}`}
                      >
                        {subtype.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </nav>
      );
  };

  const mapCategoriesOnPhone = () => {
    if (status === "fulfilled")
      return (
        <div className="flex flex-col gap-[20px] row-span-4">
          {categories.map(category => (
            <Link key={category.id} href={`/category/${category.id}`}>
              {category.name}
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
