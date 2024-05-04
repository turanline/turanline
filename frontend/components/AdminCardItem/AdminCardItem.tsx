//Global
import React, { FC } from "react";
import Image from "next/image";

//Components
import { Checkbox } from "@nextui-org/react";

//Types
import { IAdminCardItemProps } from "@/types/types";

const AdminCardItem: FC<IAdminCardItemProps> = ({
  cardImage,
  cardPrice,
  cardTitle,
  cardArticle,
  cardDate,
  cardTime,
}) => {
  return (
    <div className="admin-content_cards-item">
      <div className="admin-content_cards-item-left">
        <Checkbox className="admin-checkbox" />

        <Image src={cardImage} alt="" width={43} height={43} />

        <div className="admin-content_cards-item-block">
          <div className="admin-content_cards-item-block-text">
            <span className="admin-content_cards-item-block-title">
              {cardTitle}
            </span>

            <span className="admin-content_cards-item-block-article">
              {cardArticle}
            </span>
          </div>

          <div className="admin-content_cards-item-block-buttons">
            <button className="admin-content_cards-item-block-button">
              Изменить
            </button>

            <button className="admin-content_cards-item-block-button">
              Удалить
            </button>

            <button className="admin-content_cards-item-block-button">
              Дублировать
            </button>

            <button className="admin-content_cards-item-block-button">
              Перейти
            </button>
          </div>
        </div>

        <span className="admin-content_cards-item-span">В наличии</span>

        <span className="admin-content_cards-item-price">{cardPrice}$</span>

        <span className="admin-content_cards-item-span">Текстиль</span>
      </div>

      <span className="admin-content_cards-item-date">
        {cardDate} в {cardTime}
      </span>
    </div>
  );
};

export { AdminCardItem };
