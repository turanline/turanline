"use client";
//GLobal
import React, { FC, useState, useRef, useEffect } from "react";
//Components
import { Icons } from "../Icons/Icons";
import { ProviderOrderItem } from "../ProviderOrderItem/ProviderOrderItem";
//Types
import { IUserOrderWrapperProps } from "@/types/componentsTypes";
//Hooks
import { useTranslate } from "@/hooks/useTranslate";
//Styles
import "./ProviderOrderWrapper.scss";
import OrderStatus from "../OrderStatus/OrderStatus";

const ProviderOrderWrapper: FC<IUserOrderWrapperProps> = ({
  orderDate,
  orderNumber,
  orderPrice,
  orderStatus,
  appealModal,
  setAppealModal,
  orderInformation,
  onItemClick = () => {}
}) => {

  const translate = useTranslate();

  const [isHidden, setIsHidden] = useState<boolean>(true);
  const [wrapperHeight, setWrapperHeight] = useState<number | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const wrapperStyles = {
    maxHeight: isHidden ? "35px" : `${wrapperHeight}px`,
    transition: "max-height 0.3s ease-in-out",
  };

  const changeModalStatusAppeal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAppealModal(!appealModal)
  };

  const renderGoodsInOrder = () => {
    if (!orderInformation?.length) return <h3>Товаров нет</h3>;

    return orderInformation?.map(good => {
      const cardImage: string | null = good?.product?.images[0]?.image_file;

      return (
        <ProviderOrderItem
          key={good?.product?.id}
          cardColor={good?.color?.color}
          cardAmount={good?.amount}
          cardPriceAll={good?.sum}
          cardPrice={good?.product?.price}
          cardTitle={good?.product?.name}
          cardSlug={good?.product?.article_number}
          cardImg={cardImage}
        />
      );
    });
  };

  const setHiden = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsHidden(!isHidden)
  };


  useEffect(() => {
    setWrapperHeight(contentRef.current?.scrollHeight || null);
  }, [isHidden]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setWrapperHeight(entry.target.scrollHeight);
      }
    });

    const currentContentRef = contentRef.current;

    if (currentContentRef) {
      resizeObserver.observe(currentContentRef);
    }

    return () => {
      if (currentContentRef) {
        resizeObserver.unobserve(currentContentRef);
      }
    };
  }, []);

  return (
    <div style={wrapperStyles} className="provider-content_orders-content-order-wrapper" ref={contentRef}>
      <div onClick={onItemClick} key={orderNumber} className="provider-content_orders-content-order">
        <button
          data-order
          className="provider-content_orders-content-order-span"
          onClick={setHiden}
        >
          {translate.orderNumberOrders} #{orderNumber}
        </button>

        <span data-date className="provider-content_orders-content-order-span">
          {orderDate?.split('T')[0]}
        </span>

        <span data-price className="provider-content_orders-content-order-span">
          ${orderPrice}
        </span>

          {<OrderStatus status={orderStatus} />}

        <button onClick={changeModalStatusAppeal} className="provider-content_orders-content-order-button">
          <Icons id="flag" />
          {translate.makeAppealOrders}
        </button>

      </div>

      <div className="goodsInOrder">
        {renderGoodsInOrder()}
      </div>
    </div>
  );
};

export { ProviderOrderWrapper };
