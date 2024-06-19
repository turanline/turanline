"use client";

//Global
import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";

//Image
import like from "@/public/assets/other/likeProduct.png";
import likeRed from "@/public/assets/other/likeProductActive.png";

//Components
import { Button } from "@nextui-org/react";

//Hooks
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useTranslate } from "@/hooks/useTranslate";

//Types
import { IProductMainPage } from "@/types/types";

//Styles
import "./ProductCard.scss";

const ProductCard: FC<{ productInfo: IProductMainPage }> = ({
  productInfo,
}) => {
  const { isAuth } = useTypedSelector(state => state.user),
    { favorites } = useTypedSelector(state => state.favorites);

  const { productPageButton } = useTranslate();

  const { addItemToCart } = useCart();

  const { addToFavorites, deleteFromFavorites } = useFavorites();

  const itemInFavorites = favorites.find(item => item.id === productInfo.id);

  const returnAllProductSubTypes = () => {
    let subTypes: IProductMainPage["subTypes"] = [];

    productInfo.subTypes.forEach(subType => subTypes.push(subType));

    return subTypes;
  };

  const likeHandleClick = () => {
    if (!itemInFavorites) {
      addToFavorites(productInfo, isAuth);
    } else {
      deleteFromFavorites(productInfo);
    }
  };

  const mapSizesProductCard = () => {
    const sizesArray: { size: string }[] = [
      { size: "XXL" },
      { size: "XL" },
      { size: "L" },
      { size: "M" },
      { size: "S" },
    ];

    return sizesArray.map((item, index) => (
      <button
        key={index}
        className="py-[5px] px-[10px] border-1 border-border cursor-pointer hover:border-tiffani"
      >
        <p className="font-medium">{item.size}</p>
      </button>
    ));
  };

  return (
    <div className="product_card">
      <div className="w-full h-fit relative">
        <Link href={`/product/${productInfo.slug}`}>
          <Image
            className="product_image"
            src={productInfo.image ? productInfo.image : ""}
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

        <div className="flex w-full max-w-[230px] justify-between">
          {mapSizesProductCard()}
        </div>

        <div className="flex gap-[10px]">
          <button className="w-[30px] h-[30px] rounded-full drop-shadow-md bg-black border-2 border-white"></button>

          <button className="w-[30px] h-[30px] rounded-full drop-shadow-md bg-blue border-2 border-white"></button>

          <button className="w-[30px] h-[30px] rounded-full drop-shadow-md bg-white border-2 border-gray-color"></button>

          <button className="w-[30px] h-[30px] rounded-full drop-shadow-md bg-brown border-2 border-white"></button>
        </div>
      </div>

      <Button
        onClick={() => addItemToCart(productInfo, 1, isAuth)}
        className="bg-tiffani text-white rounded-md w-full h-[44px] py-[10px]"
      >
        {productPageButton}
      </Button>
    </div>
  );
};

export { ProductCard };
