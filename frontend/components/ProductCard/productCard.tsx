"use client";

//Global
import React, { FC, useState } from "react";
import Image from "next/image";
import Link from "next/link";

//Image
import like from "@/public/assets/other/likeProduct.png";
import likeRed from "@/public/assets/other/likeProductActive.png";

//Utils
import { getGoogleDriveImageUrl } from "@/utils/googleImage";

//Components
import { Button } from "@nextui-org/react";

//Hooks
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { useTypedSelector } from "@/hooks/useReduxHooks";
import { useTranslate } from "@/hooks/useTranslate";
import { useProducts } from "@/hooks/useProducts";

//Component Types
import { IProductMainPage } from "@/types/componentTypes";

//Styles
import "./ProductCard.scss";

const ProductCard: FC<{ productInfo: IProductMainPage }> = ({
  productInfo,
}) => {
  const [colorId, setColorId] = useState<number>(0),
    [sizeId, setSizeId] = useState<number>(0);

  const { isAuth } = useTypedSelector(state => state.user),
    { favorites } = useTypedSelector(state => state.favorites),
    { productPageButton } = useTranslate(),
    { addItemToCart } = useCart(),
    { addToFavorites, deleteFromFavorites } = useFavorites(),
    { mapProductOptions } = useProducts();

  const itemInFavorites = favorites.find(item => item.id === productInfo.id);

  const returnAllProductSubTypes = () => {
    let subTypes: IProductMainPage["subTypes"] = [];

    productInfo.subTypes.forEach(subType => subTypes.push(subType));

    return subTypes;
  };

  const likeHandleClick = () => {
    if (!itemInFavorites) {
      addToFavorites(productInfo, isAuth);
      return;
    }

    deleteFromFavorites(productInfo);
  };

  const handleAddToCart = () =>
    addItemToCart({
      amount: 1,
      color: colorId,
      size: sizeId,
      product: productInfo.id,
    });

  const imageUrl = productInfo.images[0]
    ? getGoogleDriveImageUrl(productInfo.images[0].image_url)
    : "";

  return (
    <div className="product_card">
      <div className="w-full h-fit relative">
        <Link href={`/product/${productInfo.slug}`}>
          <Image
            className="product_image"
            src={imageUrl}
            alt="cardImg"
            width={500}
            height={500}
          />
        </Link>

        <button
          onClick={likeHandleClick}
          className={`absolute top-[14px] right-[14px] bg-${
            !itemInFavorites ? "white" : "pink"
          } rounded-full p-[10px]`}
        >
          <Image
            className="w-[20px] h-[20px]"
            src={!itemInFavorites ? like : likeRed}
            alt={"like"}
          />
        </button>
      </div>
      <div className="flex flex-col gap-[25px]">
        <Link
          href={`product/${productInfo.slug}`}
          className="product_card_link"
        >
          {productInfo.name}
        </Link>

        <p className="text-tiffani">
          {returnAllProductSubTypes().map(subType => `${subType.name} `)}
        </p>

        <div className="w-fit py-[5px] px-[10px] border-1 border-border rounded-md">
          <p className="font-medium">{`$${productInfo.price}`}</p>
        </div>

        <div className="flex  gap-[10px]">
          {mapProductOptions(
            productInfo?.size,
            sizeId,
            setSizeId,
            "button-option_size"
          )}
        </div>

        <div className="flex gap-[10px]">
          {mapProductOptions(
            productInfo?.color,
            colorId,
            setColorId,
            "button-option_color",
            true
          )}
        </div>
      </div>

      <Button
        onClick={handleAddToCart}
        className="bg-tiffani text-white rounded-md w-full h-[44px] py-[10px]"
      >
        {productPageButton}
      </Button>
    </div>
  );
};

export { ProductCard };
