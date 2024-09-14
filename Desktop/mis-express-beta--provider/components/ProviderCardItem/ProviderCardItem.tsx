"use client";
//Global
import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
//Rofls
import { showToastMessage } from "@/app/toastsChange";
//Hooks
import { useUserActions } from "@/hooks/useUserActions";
import { useTranslate } from "@/hooks/useTranslate";

//Types
import { IProviderCardProps } from "@/types/componentsTypes";
//Styles
import "./ProviderCardItem.scss";

const ProviderCardItem: FC<IProviderCardProps> = ({
  cardImage,
  cardPrice,
  cardTitle,
  cardArticle,
  cardDate,
  cardTime,
  cardCompound,
  cardStatusText,
  cardSlug,
  cardStatus
}) => {
  
  const {onDeleteProviderProduct,onGetProviderGoods,onChangeProviderProduct} = useUserActions();
  const {
    productsPageToBin,
    productsPageToSlug,
    orderPageCart,
    backGood,
    deleteCard,
  } = useTranslate();

  const deleteProduct = () =>
    onDeleteProviderProduct(cardSlug)
      .then(() => {
        onGetProviderGoods();
        if (cardStatus === "B")
          showToastMessage("success", "Товар успешно удален !");
        else showToastMessage("success", "Товар перемещен в корзину !");
      })
      .catch(error => console.error(error));

  const handleChangeProduct = () =>
    onChangeProviderProduct(cardSlug)
    .then((response) => {
      if(response){
        showToastMessage("success", "Товар перемещен из корзины!");
        onGetProviderGoods();
      }else{
        showToastMessage("error", "Что-то не так");
        onGetProviderGoods();
      }
    });


  const renderUrl  = cardImage ? cardImage : "";
  const buttonText = (cardStatus === "B") ? deleteCard : productsPageToBin;

  const renderCardButton = () => {
    if(cardStatus === "B")return (
      <button onClick={handleChangeProduct}>{backGood}</button>
    );
  };


  return (
    <div className="provider-card">
      <div className="provider-card_title">
        <Image src={renderUrl} width={50} height={50} alt={cardTitle} />

        <div className="provider-card_title-block">
          <span className="product-title">{cardTitle}</span>

          <div className="provider-card_title-block_buttons">
            <button onClick={deleteProduct}>{buttonText}</button>

            <Link href={`/product/${cardSlug}`}>{productsPageToSlug}</Link>

            {renderCardButton()}
          </div>
        </div>
      </div>

      <div className="provider-card_options">
        <span className="products-content_cards-item-article">
          {cardArticle}
        </span>

        <span className="products-content_cards-item-span">{cardStatusText}</span>

        <span className="products-content_cards-item-price">{cardPrice}$</span>

        <span className="products-content_cards-item-span">{cardCompound}</span>
      </div>

      <span className="products-content_cards-item-date">
        {cardDate} - {cardTime}
      </span>
    </div>
  );
};

export { ProviderCardItem };
