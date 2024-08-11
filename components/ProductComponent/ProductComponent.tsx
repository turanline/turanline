"use client";
//Global
import React, { CSSProperties, ChangeEvent, useMemo, useState } from "react";
import Image from "next/image";
//Components
import { Icons } from "../Icons/Icons";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
//Utils
import { SHOP_ROUTE, CATALOG_ROUTE } from "@/utils/Consts";

//Hooks
import { useCart } from "@/hooks/useCart";
import { useTranslate } from "@/hooks/useTranslate";
import { useProducts } from "@/hooks/useProducts";
//Component Types
import { IProductMainPage } from "@/types/componentTypes";
//Styles
import "./ProductComponent.scss";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

const ProductComponent = ({ oneProduct }: { oneProduct: IProductMainPage }) => {
  
  const [productCounter, setProductCounter] = useState<number | string>(1),
    [thumbsSwiper, setThumbsSwiper] = useState<any | null>(null),
    [colorId, setColorId] = useState<number>(0),
    [sizeId, setSizeId] = useState<number>(0),
    { addItemToCart } = useCart(),
    { mapProductOptions } = useProducts();

  const allImages = [...oneProduct.images.map(image => image.image_file)];

  const {
    mainPageRoute,
    headerCatalog,
    productPageButton,
    productPageCompound,
    productPageCountry,
    productPageDescription,
    productPageInStock,
    productPageManufacturer,
    productPagePattern,
    productPageSeason,
    productPageArticle,
  } = useTranslate();

  const handleAddToCart = () =>
    addItemToCart({
      amount: +productCounter,
      color: colorId,
      size: sizeId,
      product: oneProduct.id,
    });

  const changeProductCounter = (action: "inc" | "dec") => {
    if (action === "dec" && +productCounter > 1)
      setProductCounter(prev => +prev - 1);

    if (action === "inc") setProductCounter(prev => +prev + 1);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "" || +value === 0) setProductCounter("");

    if (!isNaN(Number(value)) && Number(value) <= 100) setProductCounter(value);
  };

  //RENDER-MAP FUNCTIONS
  const renderSlider = useMemo(() => {
    const styles: CSSProperties & { [key: string]: string } = {
      "--swiper-navigation-color": "#fff",
      "--swiper-pagination-color": "#fff",
    };

    return (
      <div className="slider-wrapper">
        <Swiper
          loop={true}
          spaceBetween={10}
          navigation={true}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper2"
          wrapperClass="margin-0"
          style={styles}
        >
          {allImages?.map((image, index) => (
            <SwiperSlide key={index}>
              <Image
                src={image}
                alt={oneProduct?.name}
                width={400}
                height={400}
                className="swiper-slides-photos"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <Swiper
          onSwiper={setThumbsSwiper}
          loop={true}
          spaceBetween={10}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper"
        >
          {allImages?.map((image, index) => (
            <SwiperSlide key={index}>
              <Image
                src={image}
                alt={oneProduct?.name}
                width={90}
                height={90}
                className="swiper-slides-photos lil"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  }, [oneProduct?.name, thumbsSwiper]);

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem href={SHOP_ROUTE}>{mainPageRoute}</BreadcrumbItem>

        <BreadcrumbItem href={CATALOG_ROUTE}>{headerCatalog}</BreadcrumbItem>

        <BreadcrumbItem>{oneProduct?.name}</BreadcrumbItem>
      </Breadcrumbs>

      <div key={oneProduct?.id} className="flex flex-col mt-[30px]">
        <h1 className="text-[32px] font-medium mb-[24px]">
          {oneProduct?.name}
        </h1>

        <div className="product-page_wrapper">
          {renderSlider}

          <div className="border-1 border-border shadow-xl product-page_info">
            <div className="product-info">
              <div className="flex flex-col">
                <div className="block-option_product">
                  <p className="text-textAcc w-[160px]">
                    {productPageArticle}:&nbsp;
                  </p>

                  <p className="family-medium w-[140px]">
                    {oneProduct?.article_number}
                  </p>
                </div>

                <div className="block-option_product">
                  <p className="text-textAcc w-[160px]">
                    {productPageCompound}:&nbsp;
                  </p>

                  <p className="family-medium truncate w-[140px]">
                    {oneProduct?.compound}
                  </p>
                </div>

                <div className="block-option_product">
                  <p className="text-textAcc w-[160px]">
                    {productPageManufacturer}:&nbsp;
                  </p>

                  <p className="family-medium truncate w-[140px]">
                    {oneProduct?.brand?.name}
                  </p>
                </div>

                <div className="block-option_product">
                  <p className="text-textAcc w-[160px]">
                    {productPageSeason}:&nbsp;
                  </p>

                  <p className="family-medium truncate w-[140px]">
                    {oneProduct?.season}
                  </p>
                </div>

                <div className="block-option_product">
                  <p className="text-textAcc w-[160px]">
                    {productPagePattern}:&nbsp;
                  </p>

                  <p className="family-medium truncate w-[140px]">
                    {oneProduct?.pattern}
                  </p>
                </div>

                <div className="block-option_product">
                  <p className="text-textAcc w-[160px]">
                    {productPageCountry}:&nbsp;
                  </p>

                  <p className="family-medium truncate w-[140px]">
                    {oneProduct?.manufacturerCountry?.name}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-[10px] w-[200px]">
                <p className="text-[32px] family-medium leading-none">
                  {(+productCounter * +oneProduct?.price).toFixed(2)} $
                </p>

                <p className="text-textAcc">{productPageInStock}</p>

                {mapProductOptions(
                  oneProduct?.sizes_data,
                  sizeId,
                  setSizeId,
                  "button-option_size"
                )}

                {mapProductOptions(
                  oneProduct?.colors_data,
                  colorId,
                  setColorId,
                  "button-option_color",
                  true
                )}
              </div>
            </div>

            <div className="product-page_block-pay">
              <div className="flex">
                <button
                  onClick={() => changeProductCounter("dec")}
                  className="w-[30px] h-[30px] flex items-center justify-center cursor-pointer border-1 border-tiffani"
                >
                  <Icons id="minus" />
                </button>

                <input
                  className="input-counter"
                  value={productCounter}
                  type="number"
                  onChange={handleInputChange}
                />

                <button
                  onClick={() => changeProductCounter("inc")}
                  className="w-[30px] h-[30px] flex items-center justify-center cursor-pointer border-1 border-tiffani"
                >
                  <Icons id="plusMini" />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                className="bg-tiffani text-white rounded-md w-full sm:w-[200px] h-[44px] py-[10px]"
              >
                {productPageButton}
              </Button>
            </div>
          </div>
        </div>

        <div className="product-page_description">
          <p className="text-[24px] family-medium">{productPageDescription}</p>

          <p>{oneProduct?.description}</p>
        </div>
      </div>
    </>
  );
};

export { ProductComponent };
