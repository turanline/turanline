"use client";

//Global
import { ChangeEvent, FC, useRef, Ref } from "react";
import { useRouter, usePathname } from "next/navigation";

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
import "../Header/Header.scss";

const HeaderSearch: FC<IHeaderSearchProps> = ({
  allCategories,
  onSetCategory,
  category,
  isHidden,
}) => {
  const inputRef: Ref<HTMLInputElement> = useRef<HTMLInputElement>(null);

  const { headerCategorySelect, headerSearchPlaceholder } = useTranslate();

  const { onSetSearchText } = useProducts();

  const { push } = useRouter(),
    pathname = usePathname();

  const handleSubmitForm = (e: any) => {
    e.preventDefault();

    if (inputRef.current) {
      const { value } = inputRef.current;

      if (pathname !== CATALOG_ROUTE) push(CATALOG_ROUTE);

      onSetSearchText(value);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    if (value) onSetCategory(value);
  };

  const newCategories = [
    { id: 4, name: "Все категории", image: null },
    ...allCategories,
  ];

  return (
    <form
      onSubmit={handleSubmitForm}
      className={`${
        isHidden ? "hidden" : "flex search-mobile"
      } lg:flex h-[56px]`}
    >
      <div className="header_search">
        <Select
          label={headerCategorySelect}
          className="max-w-xs"
          selectedKeys={[category]}
          onChange={handleChange}
          classNames={{
            trigger: "rounded-r-none shadow-none w-[170px]",
            innerWrapper: "w-fit",
            popoverContent: "w-[180px]",
            mainWrapper: "w-[170px]",
            base: "w-[170px]",
          }}
        >
          {newCategories.map(category => (
            <SelectItem key={category.name} value={category.name}>
              {category.name}
            </SelectItem>
          ))}
        </Select>

        <Input
          ref={inputRef}
          isClearable
          radius="none"
          className="w-full bg-gray-search focus:outline-none"
          placeholder={headerSearchPlaceholder}
          onClear={() => onSetSearchText("")}
          classNames={{
            inputWrapper: "shadow-none border-none",
          }}
        />
      </div>

      <Button type="submit" className="h-full bg-tiffani search-button-mobile">
        <Icons id="search" />
      </Button>
    </form>
  );
};

export { HeaderSearch };
