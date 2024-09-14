"use client";

//Global
import { ChangeEvent, FC } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useForm } from "react-hook-form";

//Components
import { Select, SelectItem, Input, Button } from "@nextui-org/react";
import { Icons } from "../Icons/Icons";

//Utils
import { CATALOG_ROUTE } from "@/utils/Consts";

//Hooks
import { useProducts } from "@/hooks/useProducts";
import { useTranslate } from "@/hooks/useTranslate";

//Types
import { IHeaderSearchProps } from "@/types/types";

//Styles
import "@/components/SearchModal/SearchModal.scss";

const HeaderSearch: FC<IHeaderSearchProps> = ({
  allCategories,
  onSetCategory,
  category,
  isHidden,
}) => {
  const { push } = useRouter(),
    pathname = usePathname();

  const { headerCategorySelect, headerSearchPlaceholder } = useTranslate();

  const { reset, getValues, handleSubmit, register } = useForm<{
    search: string;
  }>();

  const { onSetSearchText } = useProducts();

  const handleSubmitForm = () => {
    if (pathname !== CATALOG_ROUTE) push(CATALOG_ROUTE);
    onSetSearchText(getValues().search);
  };

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (pathname !== CATALOG_ROUTE) push(CATALOG_ROUTE);
    onSetCategory(e.target.value);
  };

  const handleClear = () => {
    onSetSearchText("");
    reset();
  };

  const newCategories = [
    { id: 4, name: "Все категории", image: null },
    ...allCategories,
  ];

  return (
    <form
      onSubmit={handleSubmit(handleSubmitForm)}
      className={`${
        isHidden ? "hidden" : "search-mobile"
      } lg:flex h-[56px] overflow-hidden rounded-[10px]`}
    >
      <div className="flex w-[900px]">
        <Select
          disallowEmptySelection
          label={headerCategorySelect}
          selectedKeys={[category]}
          onChange={handleChange}
          classNames={{
            popoverContent: "w-[170px]",
            mainWrapper: "w-[170px]",
            base: "w-[170px]",
            trigger:
              "rounded-none shadow-none transition duration-200 ease bg-white",
          }}
        >
          {newCategories.map(category => (
            <SelectItem key={category.name} value={category.name}>
              {category.name}
            </SelectItem>
          ))}
        </Select>

        <Input
          {...register("search")}
          isClearable
          radius="none"
          className="w-full focus:outline-none"
          placeholder={headerSearchPlaceholder}
          onClear={handleClear}
          classNames={{
            inputWrapper: "shadow-none border-none h-[56px] bg-white",
            mainWrapper: "h-[56px] transition duration-200 ease",
          }}
        />
      </div>

      <Button
        type="submit"
        className="h-full bg-white search-button-mobile transition duration-200 ease"
      >
        <Icons id="searchMobile" />
      </Button>
    </form>
  );
};

export { HeaderSearch };
