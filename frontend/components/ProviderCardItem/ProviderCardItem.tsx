//Global
import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";

//Components
import { Checkbox } from "@nextui-org/react";

//Utils
import { PROVIDER_PRODUCT_ROUTE } from "@/utils/Consts";

//Types
import { IAdminCardItemProps } from "@/types/types";

const ProviderCardItem: FC<IAdminCardItemProps> = ({
  cardImage,
  cardPrice,
  cardTitle,
  cardArticle,
  cardDate,
  cardTime,
}) => {
  return (
    <div className="products-content_cards-item">
      <div className="products-content_cards-item-left">
        <Checkbox className="products-checkbox" />

        <div className="bg-black w-[43px] h-[43px]" />

        <div className="products-content_cards-item-block">
          <div className="products-content_cards-item-block-text">
            <span className="products-content_cards-item-block-title">
              {cardTitle}
            </span>

            <span className="products-content_cards-item-block-article">
              {cardArticle}
            </span>
          </div>

          <div className="products-content_cards-item-block-buttons">
            <Link
              href={PROVIDER_PRODUCT_ROUTE}
              className="products-content_cards-item-block-button"
            >
              Изменить
            </Link>

            <button className="products-content_cards-item-block-button">
              Удалить
            </button>

            <button className="products-content_cards-item-block-button">
              Дублировать
            </button>

            <button className="products-content_cards-item-block-button">
              Перейти
            </button>
          </div>
        </div>

        <span className="products-content_cards-item-span">В наличии</span>

        <span className="products-content_cards-item-price">{cardPrice}$</span>

        <span className="products-content_cards-item-span">Текстиль</span>
      </div>

      <span className="products-content_cards-item-date">
        {cardDate} в {cardTime}
      </span>
    </div>
  );
};

export { ProviderCardItem };
