"use client";
// Global
import React, { FC } from "react";
import Image from "next/image";
import NoImage from '@/public/assets/other/no_picture_create.png';
//Component Types
import { IUserOrderItem } from "@/types/componentTypes";
//styles
import "./UserOrderItem.scss";
import { useTranslate } from "@/hooks/useTranslate";

const UserOrderItem: FC<IUserOrderItem> = ({ amount, color, product,sum }) => {
  const translate = useTranslate()
  const productImage = product?.images[0]?.image_file ? product?.images[0]?.image_file : NoImage;


  return (
    <section className="product-card">
      <div className="product-card__image-container">
        <Image src={productImage} alt={product?.name} width={111} height={111} />

        <div className="product-card__info-container">
          <h5 className="product-card__title">{product?.name}</h5>

          <div className="product-card__options-container">
            <div className="product-card__description-container-wrapper">

              <div className="product-card__description-container">
                <p className="product-card__description">{translate.filterColor}</p>

                <div
                  data-color
                  style={{ background: color?.color }}
                  className="product-card__option"
                ></div>
              </div>

              <div className="product-card__description-container">
                <p className="product-card__description">{translate.cartItemPrice}</p>

                <div className="product-card__option">
                  <p className="font-medium">
                    ${Number(product?.price).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="product-card__total-container">
              <div className="product-card__total-description-container">
                <p className="product-card__description">{translate.cartItemCounterText}</p>

                <div data-counter className="product-card__option">
                  <p className="font-medium">{amount}</p>
                </div>
              </div>

              <div className="product-card__total-description-container">
                <p className="product-card__description">{translate.cartItemTotalPrice}</p>

                <div className="product-card__option">
                  <p className="font-medium">
                    ${sum}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { UserOrderItem };
