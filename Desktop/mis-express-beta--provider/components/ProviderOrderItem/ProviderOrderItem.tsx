"use client";
// Global
import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
//Hooks
import { useTranslate } from "@/hooks/useTranslate";
//Types
import { IUserOrderItemProps } from "@/types/componentsTypes";
//styles
import "./ProviderOrderItem.scss";

const ProviderOrderItem: FC<IUserOrderItemProps> = ({
  cardTitle,
  cardPrice,
  cardSize,
  cardColor,
  cardAmount,
  cardPriceAll,
  cardSlug,
  cardImg,
}) => {

  const {
    filterSize,
    filterColor,
    cartItemPrice,
    cartItemCounterText,
    cartItemTotalPrice,
  } = useTranslate();

  
  
  return (
    <section className="product-card">
      <div className="product-card__image-container">
        <Link href={`product/${cardSlug}`}>
          <Image src={cardImg || ''} alt={cardTitle} width={111} height={111} />
        </Link>

        <div className="product-card__info-container">
          <Link href={`product/${cardSlug}`} className="product-card__title">
            {cardTitle}
          </Link>
          <div className="product-card__options-container">
            <div className="product-card__description-container-wrapper">
              <div className="product-card__description-container">
                <p className="product-card__description">{filterSize}</p>

                <div className="product-card__option">
                  <p className="product-card__option--active font-medium">
                    {cardSize}
                  </p>
                </div>
              </div>

              <div className="product-card__description-container">
                <p className="product-card__description">{filterColor}</p>

                <div
                  style={{ background: `${cardColor}` }}
                  data-color
                  className="product-card__option"
                ></div>
              </div>

              <div className="product-card__description-container">
                <p className="product-card__description">{cartItemPrice}</p>

                <div className="product-card__option">
                  <p className="font-medium">${cardPrice}</p>
                </div>
              </div>
            </div>

            <div className="product-card__total-container">
              <div className="product-card__total-description-container">
                <p className="product-card__description">{cartItemCounterText}</p>

                <div data-counter className="product-card__option">
                  <p className="font-medium">{cardAmount}</p>
                </div>
              </div>

              <div className="product-card__total-description-container">
                <p className="product-card__description">{cartItemTotalPrice}</p>

                <div className="product-card__option">
                  <p className="font-medium">${cardPriceAll}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { ProviderOrderItem };
