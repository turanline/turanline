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

const ProviderOrderWrapper: FC<IUserOrderWrapperProps> = ({
  orderDate,
  orderNumber,
  orderPrice,
  orderStatus,
  appealModal,
  setAppealModal,
  orderInformation,
}) => {

  const {
    orderNumberOrders,
    makeAppealOrders,
    productStatusDelivered,
    productStatusBundle,
    productStatusTransit,
    productStatusCreated,
    productStatusUnknown,
  } = useTranslate();

  const [isHidden, setIsHidden] = useState<boolean>(true);
  const [wrapperHeight, setWrapperHeight] = useState<number | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);

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

  const returnOrderStatus = (status: string) => {
    let orderStatusText;
    let iconId;
    let buttonStyles;

    switch (status) {
      case "FD":
        orderStatusText = productStatusDelivered;
        iconId = "deliveredOrder";
        buttonStyles = {
          backgroundColor: "#ECFFFE",
          color: "#0ABAB5",
        };

        break;
      case "CD":
        orderStatusText = productStatusBundle;
        iconId = "Packed";
        buttonStyles = {
          backgroundColor: "#FEFFF3",
          color: "#FFD600",
        };
        break;
      case "PR":
        orderStatusText = productStatusTransit;
        iconId = "car";
        buttonStyles = {
          backgroundColor: "#fff3fa",
          color: "#e30387",
        };

        break;
      case "CR":
        orderStatusText = productStatusCreated;
        iconId = "deliveredOrder";
        buttonStyles = {
          backgroundColor: "#ECFFFE",
          color: "#0ABAB5",
        };

        break;
      default:
        orderStatusText = productStatusUnknown;
        iconId = "car";
        buttonStyles = {
          backgroundColor: "#fff3fa",
          color: "#e30387",
        };
        break;
    }

    return (
      <button
        style={buttonStyles}
        className="provider-content_orders-content-order-status"
      >
        <Icons id={iconId} />
        {orderStatusText}
      </button>
    );
  };

  const wrapperStyles = {
    maxHeight: isHidden ? "25px" : `${wrapperHeight}px`,
    transition: "max-height 0.3s ease-in-out",
  };

  const changeModalStatusAppeal = () => setAppealModal(!appealModal);

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
          cardSize={good?.size?.name}
          cardPrice={good?.product?.price}
          cardTitle={good?.product?.name}
          cardSlug={good?.product?.slug}
          cardImg={cardImage}
        />
      );
    });
  };

  const setHiden = () => setIsHidden(!isHidden);

  return (
    <div style={wrapperStyles} className="provider-content_orders-content-order-wrapper" ref={contentRef}>
      <div key={orderNumber} className="provider-content_orders-content-order">
        <button
          data-order
          className="provider-content_orders-content-order-span"
          onClick={setHiden}
        >
          {orderNumberOrders} #{orderNumber}
        </button>

        <span data-date className="provider-content_orders-content-order-span">
          {orderDate?.split('T')[0]}
        </span>

        <span data-price className="provider-content_orders-content-order-span">
          ${orderPrice}
        </span>

          {returnOrderStatus(orderStatus)}

        <button onClick={changeModalStatusAppeal} className="provider-content_orders-content-order-button">
          <Icons id="flag" />
          {makeAppealOrders}
        </button>

      </div>

      <div className="goodsInOrder">
        {renderGoodsInOrder()}
      </div>
    </div>
  );
};

export { ProviderOrderWrapper };
