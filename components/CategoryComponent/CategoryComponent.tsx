"use client";

//Global
import Image from "next/image";
import { FC } from "react";

//Components
import { Icons } from "@/components/Icons/Icons";
import { Divider } from "@nextui-org/react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";

//Utils
import { SHOP_ROUTE } from "@/utils/Consts";

//Hooks
import { useTranslate } from "@/hooks/useTranslate";
import { useCategories } from "@/hooks/useCategories";
import { useTypedSelector } from "@/hooks/useReduxHooks";

//Styles
import "swiper/css";
import "./CategoryComponent.scss";
import "swiper/css/pagination";

const CategoryComponent: FC<{ categoryObject: any; categoryId: number }> = ({
  categoryObject,
  categoryId }) => {
  const { status } = useTypedSelector(state => state.categories);

  const { mainPageRoute, lookAll } = useTranslate();

  const { returnSubtypesByType, returnTypesByCategory } = useCategories("");

  const categoryName = Object.keys(categoryObject)[0];

  if (status === "pending") return <Icons id="spiner" />;

  const renderCategory = () =>
    returnTypesByCategory(categoryId).map(({ name, id: typeId, image }, index: number) => {
      
        const filteredSubtypes = returnSubtypesByType(typeId);

        return (
          <div key={index} className="w-full flex flex-col">
            <Image
              className="w-full h-[300px] rounded-md mb-[20px]"
              src={image.toString()}
              alt={name}
              width={150}
              height={300}
            />

            <span className="text-[24px]">{name}</span>

            <Accordion
              showDivider={false}
              itemClasses={{
                base: "family-bold flex flex-col",
                title: "text-base",
                trigger: "flex-row-reverse",
              }}
            >
              {filteredSubtypes.map(({ name }, index) => (
                <AccordionItem
                  key={index}
                  aria-label={name}
                  indicator={<Icons id="plusAcc" />}
                  title={
                    <div className="flex justify-between">
                      <span className="w-[217px]">{name}</span>

                      <span>{filteredSubtypes.length}</span>
                    </div>
                  }
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </AccordionItem>
              ))}
            </Accordion>

            <Divider className="my-1" />

            <div className="flex justify-between">
              <p className="w-[217px] truncate">{lookAll}</p>

              <p>{filteredSubtypes.length}</p>
            </div>
          </div>
        );
      }
    );

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem href={SHOP_ROUTE}>{mainPageRoute}</BreadcrumbItem>
        <BreadcrumbItem>{categoryName}</BreadcrumbItem>
      </Breadcrumbs>

      <h3 className="family-medium font-bold text-[32px] text-tiffani mt-[49px] mb-[37px]">
        {categoryName}
      </h3>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[44px] mb-[47px]">
        {renderCategory()}
      </div>
    </>
  );
};

export { CategoryComponent };
