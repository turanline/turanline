"use client";
//Global
import React, { CSSProperties, ChangeEvent,useEffect,useMemo, useState } from "react";
import Image from "next/image";
import { getCookie, setCookie } from "cookies-next";
//Components
import { Icons } from "../Icons/Icons";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
//Swiper
import Zoom from 'react-medium-image-zoom';
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
//Images
import NoPicture from '@/public/assets/other/no_picture_create.png';
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
import 'react-medium-image-zoom/dist/styles.css';
import { showToastMessage } from "@/app/toastsChange";



const ProductComponent = ({ oneProduct }: { oneProduct: IProductMainPage}) => {


  const [productCounter, setProductCounter] = useState<number>(1);
  const [thumbsSwiper, setThumbsSwiper] = useState<any | null>(null);
  const [colorId, setColorId] = useState<number>(0);
  const { addItemToCart,onFetchCart } = useCart();
  const { renderColorOptions } = useProducts();
  const [product,setProduct] = useState<IProductMainPage>()
  const translate = useTranslate();
  
  const allImages = [...oneProduct?.images?.map((image) => image?.image_file)];


  const handleAddToCart = () => {
    try {
      const requestBody = {
        amount: +productCounter,
        color: colorId,
        product: oneProduct.id,
      };

    addItemToCart(requestBody)
    ?.then(response => {
      if ("error" in response && response?.error?.message === "Rejected") {
        showToastMessage("error", translate.messageCartAddedError);
        return;
      }

      onFetchCart();
      showToastMessage("success", translate.messageCartAdded);
    })
    .catch(error => console.error(error))
    .finally(() => {
        setColorId(0);
    });
    } catch (error) {
      showToastMessage('warn','Товар не был добавлен в корзину');
    }
  }

  const changeProductCounter = (action: "inc" | "dec") => {
    if (action === "dec" && productCounter > 1)
      setProductCounter((prev) => prev - 1);

    if (action === "inc" && productCounter < 99)
      setProductCounter((prev) => prev + 1);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = Number(value);

    if (isNaN(numericValue)) {
      return;
    }

    if (numericValue < 1) {
      setProductCounter(1);
    } else {
      setProductCounter(numericValue);
    }
  };

  // //RENDER-MAP FUNCTIONS
  const renderSlider = useMemo(() => {
    const styles: CSSProperties & { [key: string]: string } = {
      "--swiper-navigation-color": "#fff",
      "--swiper-pagination-color": "#fff",
    };

    const renderSlides = () => {
      if (!allImages?.length)
        return (
          <SwiperSlide>
            <Image
              src={NoPicture}
              alt={'carousel-images'}
              width={400}
              height={400}
              className="swiper-slides-photos"
            />
          </SwiperSlide>
        );

      return allImages?.map((image, index) => (
        <SwiperSlide key={index}>
          <Zoom>
            <Image
              src={image || NoPicture}
              alt={'carousel-images'}
              width={400}
              height={400}
              className="swiper-slides-photos"
            />
          </Zoom>
        </SwiperSlide>
      ));
    };

    const renderLilSlides = () => {
      if (!allImages?.length) return;

      return (
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
                src={image || NoPicture}
                alt={'carousel-images-lil'}
                width={90}
                height={90}
                className="swiper-slides-photos lil"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      );
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
          {renderSlides()}
        </Swiper>

        {renderLilSlides()}
      </div>
    );
  }, [thumbsSwiper]);


  const renderSizes = () => oneProduct?.sizes_data?.map(({name,amount}) => (
      <p key={name} className="button-option_size">
          {name}-{amount}
      </p>
  ));


 

  return (
    <main>
      <Breadcrumbs>
        <BreadcrumbItem href={SHOP_ROUTE}>{translate.mainPageRoute}</BreadcrumbItem>

        <BreadcrumbItem href={CATALOG_ROUTE}>{translate.headerCatalog}</BreadcrumbItem>

        <BreadcrumbItem>{oneProduct?.name}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="flex flex-col mt-[30px]">
        <h1 className="text-[26px] sm:text-[32px] font-medium mb-[24px]">
          {oneProduct?.name}
        </h1>

        <div className="product-page_wrapper">
          {renderSlider}

          <div className="border-1 border-border shadow-xl product-page_info">
            <div className="product-info">
              <div className="flex flex-col max-md:mx-auto max-w-[300px] w-full product-info_table">
                <div className="block-option_product">
                  <p className="text-textAcc w-[160px]">
                    {translate.productPageArticle}:
                  </p>

                  <p className="family-medium w-[140px]">
                    {oneProduct?.article_number}
                  </p>
                </div>

                <div className="block-option_product">
                  <p className="text-textAcc w-[160px]">
                    {translate.productPageCompound}:
                  </p>

                  <p className="family-medium w-[140px]">
                    {oneProduct?.compound}
                  </p>
                </div>

                <div className="block-option_product">
                  <p className="text-textAcc w-[160px]">
                    {translate.productPageManufacturer}:
                  </p>

                  <p className="family-medium truncate w-[140px]">
                    {oneProduct?.provider?.company}
                  </p>
                </div>

                <div className="block-option_product">
                  <p className="text-textAcc w-[160px]">
                    {translate.productPageSeason}:
                  </p>

                  <p className="family-medium truncate w-[140px]">
                    {oneProduct?.season}
                  </p>
                </div>

                <div className="block-option_product">
                  <p className="text-textAcc w-[160px]">
                    {translate.productPagePattern}:
                  </p>

                  <p className="family-medium truncate w-[140px]">
                    {oneProduct?.pattern}
                  </p>
                </div>

                <div className="block-option_product">
                  <p className="text-textAcc w-[160px]">
                    {translate.productPageCountry}:
                  </p>

                  <p className="family-medium truncate w-[140px]">
                    {oneProduct?.manufacturerCountry?.name}
                  </p>
                </div>
                <div className="block-option_product">
                  <p className="text-textAcc w-[160px]">
                    {translate.productWeight}:
                  </p>

                  <p className="family-medium truncate w-[140px]">
                    {oneProduct?.weight}
                  </p>
                </div>
                <div className="block-option_product">
                  <p className="text-textAcc w-[160px]">
                    {translate.productMold}:
                  </p>

                  <p className="family-medium truncate w-[140px]">
                    {oneProduct?.mold}
                  </p>
                </div>
                <div className="block-option_product">
                  <p className="text-textAcc w-[160px]">
                    {translate.materialTitle}:
                  </p>

                  <p className="family-medium truncate w-[140px]">
                    {oneProduct?.material}
                  </p>
                </div>
                <div className="block-option_product">
                  <p className="text-textAcc w-[160px]">
                    {translate.headerCategorySelect}:
                  </p>

                  <p className="family-medium truncate w-[140px]">
                    {oneProduct?.category?.name}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-[10px] max-md:w-[100%] max-md:max-w-[300px] w-[210px] max-md:mx-auto">
            
                <p className="text-[32px] family-medium leading-none">
                  {(+oneProduct?.price).toFixed(2)} $
                </p>
                <p className="text-price-product">{translate.productPriceDescription}*</p>

                <p className="text-textAcc">{translate.productPageInStock}</p>
                <div className="flex gap-[10px] flex-wrap">{renderSizes()}</div>

                {renderColorOptions(
                  oneProduct?.colors_data,
                  colorId,
                  setColorId,
                  "button-option_color",
                )}
              </div>
            </div>

            <div className="product-page_block-pay">
                <div className="flex flex-row items-center gap-[20px] w-full max-w-[330px]">
                    <div className="flex flex-row">
                      <button
                        onClick={() => changeProductCounter("dec")}
                        className="w-[30px] h-[30px] flex items-center justify-center cursor-pointer border-1 border-black"
                      >
                        <Icons id="minus" />
                      </button>

                      <input
                        className="input-counter"
                        value={productCounter}
                        type="tel"
                        onChange={handleInputChange}
                        maxLength={2}
                        minLength={1}
                      />

                      <button
                        onClick={() => changeProductCounter("inc")}
                        className="w-[30px] h-[30px] flex items-center justify-center cursor-pointer border-1 border-black"
                      >
                        <Icons id="plusMini" />
                      </button>
                    </div>

                  <Button
                    onClick={handleAddToCart}
                    className="bg-black text-white rounded-md w-full h-[44px] py-[10px]"
                  >
                    {translate.productPageButton}
                  </Button>
                </div>
            </div>
          </div>
        </div>

        <div className="product-page_description">
          <p className="text-[24px] family-medium">{translate.productPageDescription}</p>

          <p>{oneProduct?.description}</p>
        </div>
      </div>
    </main>
  );
};

export { ProductComponent };
