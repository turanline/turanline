"use client";

//Components
import { Icons } from "@/components/Icons/Icons";
import { Divider } from "@nextui-org/react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";

//Utils
import { SHOP_ROUTE } from "@/utils/Consts";

//Hooks
import { useTranslate } from "@/hooks/useTranslate";

//Types
import { ICategoriesObject } from "@/types/types";

//Styles
import "swiper/css";
import "./CategoryComponent.scss";
import "swiper/css/pagination";

const CategoryComponent = ({ categoriesObject }: ICategoriesObject) => {
  const { mainPageRoute, lookAll } = useTranslate();

  const categoryName = Object.keys(categoriesObject)[0];

  const itemClasses = {
    base: "family-bold flex flex-col pb-[20px] gap-[10px]",
    title: "text-base",
    trigger: "flex-row-reverse py-0",
    indicator: "py-0",
    content: "py-0",
  };

  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

  return (
    <main>
      <Breadcrumbs>
        <BreadcrumbItem href={SHOP_ROUTE}>{mainPageRoute}</BreadcrumbItem>
        <BreadcrumbItem>{categoryName}</BreadcrumbItem>
      </Breadcrumbs>

      <h3 className="family-medium font-bold text-[32px] text-tiffani mt-[49px] mb-[37px]">
        {categoryName}
      </h3>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[44px] mb-[47px]">
        {Object.entries(categoriesObject[categoryName]).map(
          ([category, { subtypes }]: [string, any], index: number) => (
            <div key={index} className="w-full flex flex-col">
              <div className="w-full h-[208px] bg-black rounded-md mb-[20px]"></div>
              <p className="text-[24px] mb-[26px]">{category}</p>
              <Accordion showDivider={false} itemClasses={itemClasses}>
                {subtypes.map((subtype: string) => (
                  <AccordionItem
                    key={subtype}
                    aria-label={subtype}
                    indicator={<Icons id="plusAcc" />}
                    title={
                      <div className="flex justify-between">
                        <p className="w-[217px] truncate">{subtype}</p>
                        <p>103</p>
                      </div>
                    }
                  >
                    {defaultContent}
                  </AccordionItem>
                ))}
              </Accordion>
              <Divider className="my-1" />
              <div className="flex justify-between">
                <p className="w-[217px] truncate">{lookAll}</p>
                <p>200</p>
              </div>
            </div>
          )
        )}
      </div>
    </main>
  );
};

export { CategoryComponent };
