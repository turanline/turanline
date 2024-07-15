"use client";
// Global
import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";

//Hooks
import { useCart } from "@/hooks/useCart";
import { useTranslate } from "@/hooks/useTranslate";

//Components
import { Icons } from "../Icons/Icons";

//Component Types
import { IProductCart } from "@/types/componentTypes";

//Styles
import "./UserCartItem.scss";

const UserCartItem: FC<{
  product: IProductCart;
}> = ({ product }) => {
  const { onChangeCardCounter, deleteCardFromBasket } = useCart();

  const {
    filterSize,
    filterColor,
    cartItemCounterText,
    cartItemPrice,
    cartItemTotalPrice,
  } = useTranslate();

  return (
    <div id={String(product.id)} className="product-card">
      <div className="product-card__image-container">
        <Link
          className="product-card-img-link"
          href={`/product/${product.product.slug}`}
        >
          <Image
            src={product.product.image ? product.product.image : ""}
            alt={product.product.name}
            width={500}
            height={500}
          />
        </Link>

        <div className="product-card__info-container">
          <Link
            href={`/product/${product.product.slug}`}
            className="product-card__title"
          >
            {product.product.name}
          </Link>

          <div className="product-card__options-container">
            <div className="product-card__description-container-wrapper">
              <div className="product-card__description-container">
                <p className="product-card__description">{filterSize}</p>

                <div className="product-card__option">
                  <p className="product-card__option--active font-medium">
                    {product.product.size.name}
                  </p>
                </div>
              </div>

              <div className="product-card__description-container">
                <p className="product-card__description">{filterColor}</p>

                <div
                  data-color
                  className="product-card__option"
                  style={{ background: product.product.color.color }}
                ></div>
              </div>

              <div className="product-card__description-container">
                <p className="product-card__description">{cartItemPrice}</p>

                <div className="product-card__option">
                  <p className="font-medium">${product.product.price}</p>
                </div>
              </div>
            </div>

            <div className="product-card__total-container">
              <div className="product-card__total-description-container">
                <p className="product-card__description">
                  {cartItemCounterText}
                </p>

                <div className="flex">
                  <button
                    onClick={() => onChangeCardCounter("dec", product)}
                    className="w-[30px] h-[30px] flex items-center justify-center cursor-pointer border-1 border-tiffani"
                  >
                    <Icons id="minus" />
                  </button>

                  <div className="w-[40px] h-[30px] flex items-center justify-center border-t-1 border-b-1 border-tiffani">
                    <p>{product.amount}</p>
                  </div>

                  <button
                    onClick={() => onChangeCardCounter("inc", product)}
                    className="w-[30px] h-[30px] flex items-center justify-center cursor-pointer border-1 border-tiffani"
                  >
                    <Icons id="plusMini" />
                  </button>
                </div>
              </div>

              <div className="product-card__total-description-container">
                <p className="product-card__description">
                  {cartItemTotalPrice}
                </p>

                <div className="product-card__option">
                  <p className="font-medium">
                    ${(+product.product.price * product.amount).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => deleteCardFromBasket(product.id)}
        className="deleteItem"
      >
        <Icons id="deleteCard" />
      </button>
    </div>
  );
};

export { UserCartItem };
