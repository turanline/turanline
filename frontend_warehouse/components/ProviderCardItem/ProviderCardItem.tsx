"use client";
//Global
import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import NoImage from '../../public/assets/other/no_picture_create.png'
//Rofls
import { showToastMessage } from "@/app/toastsChange";
//Hooks
import { useUserActions } from "@/hooks/useUserActions";
import { useTranslate } from "@/hooks/useTranslate";
//Types
import { IProviderCardProps,IGoodModal } from "@/types/componentsTypes";
//Services
import { patchProductBySlug,deleteProductBySlug } from "@/services/providerAPI";
//Utils
import { truncateText } from "@/utils/Functions";
//Styles
import "./ProviderCardItem.scss";

const ProviderCardItem: FC<IProviderCardProps> = ({ cardImage, cardPrice, cardTitle, cardArticle, cardDate, cardTime, cardCompound, cardStatusText, cardStatus ,onItemClick,setSelectedGood}) => {

  const translate = useTranslate();
  const {onGetProviderGoods} = useUserActions();

  const renderUrl  = cardImage ? cardImage : NoImage;


  const handleChangeProduct = async (status: string) => {
    try {
      const response = await patchProductBySlug(cardArticle,{status:status});

      if(response?.status === 200){
        showToastMessage("success", translate.notifySuccesStatusChanged);
      };
      if(response?.response?.status){
        showToastMessage("error", translate.notifySomethingWentWrong);
        return;
      };
      onGetProviderGoods(); 


    } catch (error) {
        console.error(error);
    }
  };

  const renderProductButtons = () => {
    switch(cardStatus){
      case "B":
       return (
         <>
           <button onClick={()=> handleChangeProduct('A')}>{translate.backGood}</button>
           <button onClick={()=> handleChangeProduct('AR')}>{translate.deleteCard}</button>
         </>
        );
      case "A":
        return (
          <>
            <button onClick={()=> handleChangeProduct('B')}>{translate.productsPageToBin}</button>
            <Link href={`/product/${cardArticle}`}>{translate.productsPageToSlug}</Link>
          </>
        );
      case "AR":
          return (
            <>
              <Link href={`/product/${cardArticle}`}>{translate.productsPageToSlug}</Link>
            </>
          );
    }
  };
  const openModalWithParams = () => {
    const selectedGood: IGoodModal = {
      cardPrice, 
      cardTitle, 
      cardArticle, 
      cardDate, 
      cardTime, 
      cardCompound, 
      cardStatusText, 
      cardStatus
    };

    onItemClick()
    setSelectedGood(selectedGood);
  };

  const preventPropagation = (event: React.MouseEvent)=> event.stopPropagation();

  return (
      <div onClick={openModalWithParams} className="provider-card">
      <div className="provider-card_title">
        <Image src={renderUrl} width={50} height={50} alt={cardTitle} />

        <div className="provider-card_title-block">
          <span className="product-title">{truncateText(cardTitle, 30)}</span>

          <div onClick={preventPropagation} className="provider-card_title-block_buttons">
                {renderProductButtons()}
          </div>
        </div>
      </div>

      <div className="provider-card_options">
        <span className="products-content_cards-item-article products-content_card-item--off">
          {cardArticle}
        </span>

        <span className="products-content_cards-item-span">{cardStatusText}</span>

        <span className="products-content_cards-item-price products-content_card-item--off">{cardPrice}$</span>

        <span className="products-content_cards-item-span products-content_card-item--off">{cardCompound}</span>
      </div>

      <span className="products-content_cards-item-date products-content_card-item--off">
        {cardDate} - {cardTime}
      </span>
    </div>
  );
};

export { ProviderCardItem };
