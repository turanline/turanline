"use client";
//Global
import React, { FC, useState } from "react";
import Image from "next/image";
import Link from "next/link";
//Image
import like from "@/public/assets/other/likeProduct.png";
import likeRed from "@/public/assets/other/likeProductActive.png";
import NoPhoto from '@/public/assets/other/no_picture_create.png';
//Components
import { Button } from "@nextui-org/react";
import { showToastMessage } from "@/app/toastsChange";
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



const ProductCard: FC<{ productInfo: IProductMainPage }> = ({ productInfo }) => {
  const [colorId, setColorId] = useState<number>(0);


  const { favorites } = useTypedSelector(state => state.favorites);
  const translate = useTranslate();
  const { addItemToCart, onFetchCart} = useCart();
  const { addToFavorites, deleteFromFavorites } = useFavorites();
  const { renderColorOptions } = useProducts();

  const itemInFavorites = favorites?.find(favorite => favorite?.id === productInfo?.id);

  const likeHandleClick = () => {
    if (!itemInFavorites) {
      addToFavorites(productInfo);
      return;
    }
    deleteFromFavorites(productInfo);
  };

  const handleAddToCart = () => {
    const requestBody = {
      amount: 1,
      color: colorId,
      product: productInfo.id,
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
  }


  const imageUrl = productInfo?.images[0]? productInfo?.images[0]?.image_file : NoPhoto;
  const buttonLikeClassName = `absolute top-[14px] right-[14px] bg-${!itemInFavorites ? "white" : "pink" } rounded-full p-[10px]`;
  const imageLikeClassName = !itemInFavorites ? like : likeRed;

  return (
    <div className="product_card">
      <div className="w-full h-fit relative">
        <Link className="imageWrapper" href={`/product/${productInfo?.article_number}`}>
          <div className="imageWrapper">
            <Image
              className="image"
              src={imageUrl}
              alt={productInfo?.name}
              layout="fill"
            />
          </div>
        </Link>

        <button
          onClick={likeHandleClick}
          className={buttonLikeClassName}
        >
          <Image
            className="w-[20px] h-[20px]"
            src={imageLikeClassName}
            alt={"like"}
          />
        </button>
      </div>
      <div className="flex flex-col gap-[15px]">
        <Link
          href={`product/${productInfo?.article_number}`}
          className="product_card_link"
        >
          {productInfo?.name}
        </Link>

        <div className="description_wrapper">
          <h3>{productInfo?.category?.name}</h3>
          <p>{productInfo?.description}</p>
        </div>

        <div className="w-fit py-[5px] px-[10px] border-1 border-border rounded-md">
          <p className="font-bold">{`$${productInfo?.price}`}</p>
        </div>

        {renderColorOptions(
          productInfo?.colors_data,
          colorId,
          setColorId,
          "button-option_color",
        )}
      </div>

      <Button
        onClick={handleAddToCart}
        className="buybutton text-white rounded-md w-full h-[44px] py-[10px]"
      >
        {translate.productPageButton}
      </Button>
    </div>
  );
};

export { ProductCard };
