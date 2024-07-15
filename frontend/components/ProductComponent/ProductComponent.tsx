"use client";

//Global
import React, { CSSProperties, useState } from "react";
import Image from "next/image";

//Components
import { Icons } from "../Icons/Icons";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { showToastMessage } from "@/app/toastsChange";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

//Utils
import { SHOP_ROUTE, CATALOG_ROUTE } from "@/utils/Consts";
import { getGoogleDriveImageUrl } from "@/utils/googleImage";

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
  const [productCounter, setProductCounter] = useState<number>(1),
    [thumbsSwiper, setThumbsSwiper] = useState<any | null>(null),
    [colorId, setColorId] = useState<number>(0),
    [sizeId, setSizeId] = useState<number>(0),
    { addItemToCart } = useCart(),
    { mapProductOptions } = useProducts();

  const allImages = [
    ...oneProduct.images.map(image => getGoogleDriveImageUrl(image.image_url)),
  ];

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
    messageCounterDec,
    messageCounterInc,
  } = useTranslate();

  const handleAddToCart = () =>
    addItemToCart({
      amount: productCounter,
      color: colorId,
      size: sizeId,
      product: oneProduct.id,
    });

  const changeProductCounter = (action: "inc" | "dec") => {
    if (action === "inc") {
      if (productCounter < oneProduct?.amount) {
        setProductCounter(prev => prev + 1);
      }
    } else {
      if (productCounter > 1) {
        setProductCounter(prev => prev - 1);
      }
    }

    if (action === "dec" && productCounter === 1)
      showToastMessage("warn", messageCounterDec);

    if (action === "inc" && productCounter === oneProduct?.amount)
      showToastMessage("warn", `${messageCounterInc} ${productCounter}!`);
  };

  const renderSlider = () => {
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
          {allImages.map((image, index) => (
            <SwiperSlide key={index}>
              <Image
                src={image ? image : ""}
                alt={oneProduct.name}
                width={400}
                height={400}
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
          {allImages.map((image, index) => (
            <SwiperSlide key={index}>
              <Image
                src={image ? image : ""}
                alt={oneProduct.name}
                width={90}
                height={90}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  };

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
          {renderSlider()}

          <div className="border-1 border-border shadow-xl product-page_info">
            <div className="product-info">
              <div className="flex flex-col gap-[10px]">
                <div className="flex">
                  <p className="text-textAcc">{productPageArticle}:&nbsp;</p>

                  <p className="family-medium">{oneProduct?.article_number}</p>
                </div>

                <div className="flex w-full">
                  <p className="text-textAcc">{productPageCompound}:&nbsp;</p>

                  <p className="family-medium truncate">
                    {oneProduct?.compound}
                  </p>
                </div>

                <div className="flex w-full">
                  <p className="text-textAcc">
                    {productPageManufacturer}:&nbsp;
                  </p>

                  <p className="family-medium truncate">
                    {oneProduct?.brand?.name}
                  </p>
                </div>

                <div className="flex w-full">
                  <p className="text-textAcc">{productPageSeason}:&nbsp;</p>

                  <p className="family-medium truncate">{oneProduct?.season}</p>
                </div>

                <div className="flex w-full">
                  <p className="text-textAcc">{productPagePattern}:&nbsp;</p>

                  <p className="family-medium truncate">
                    {oneProduct?.pattern}
                  </p>
                </div>

                <div className="flex w-full">
                  <p className="text-textAcc">{productPageCountry}:&nbsp;</p>

                  <p className="family-medium truncate">
                    {oneProduct?.manufacturerCountry?.name}
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-[10px]">
                <p className="text-[32px] family-medium">
                  {(productCounter * +oneProduct?.price).toFixed(2)} $
                </p>

                <p className="text-textAcc">{productPageInStock}</p>

                <div className="flex flex-wrap gap-[10px]">
                  {mapProductOptions(
                    oneProduct?.size,
                    sizeId,
                    setSizeId,
                    "button-option_size"
                  )}
                </div>

                <div className="flex gap-[10px]">
                  {mapProductOptions(
                    oneProduct?.color,
                    colorId,
                    setColorId,
                    "button-option_color",
                    true
                  )}
                </div>
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
                  onChange={e => setProductCounter(+e.target.value)}
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
