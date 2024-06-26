"use client";

//GLobal
import React, { FC, useState, useRef, useEffect } from "react";

//Components
import { Icons } from "../Icons/Icons";
import { ProviderOrderItem } from "../ProviderOrderItem/ProviderOrderItem";
import { Button } from "@nextui-org/react";

//Types
import { IUserOrderWrapperProps } from "@/types/types";

//Styles
import "./ProviderOrderWrapper.scss";

const ProviderOrderWrapper: FC<IUserOrderWrapperProps> = ({
  orderDate,
  orderNumber,
  orderPrice,
  orderStatus,
}) => {
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

  const returnOrderStatus = (status: typeof orderStatus) => {
    const orderStatusText =
      status === "processing" ? "В процессе" : "Доставлено";

    const iconId = status === "delivered" ? "deliveredOrder" : "car";

    const butonStyles = {
      backgroundColor: orderStatus === "processing" ? "#fff3fa" : "#ECFFFE",
      color: orderStatus === "processing" ? "#e30387" : "#0ABAB5",
    };

    return (
      <Button
        style={butonStyles}
        className="provider-content_orders-content-order-status"
      >
        <Icons id={iconId} />

        {orderStatusText}
      </Button>
    );
  };

  const wrapperStyles = {
    maxHeight: isHidden ? "27px" : `${wrapperHeight}px`,
    transition: "max-height 0.3s ease-in-out",
  };

  return (
    <div
      style={wrapperStyles}
      className="provider-content_orders-content-order-wrapper"
      ref={contentRef}
    >
      <div className="provider-content_orders-content-order">
        <span
          className="provider-content_orders-content-order-span"
          onClick={() => setIsHidden(!isHidden)}
        >
          Заказ #{orderNumber}
        </span>

        <span data-date className="provider-content_orders-content-order-span">
          {orderDate}
        </span>

        <span className="provider-content_orders-content-order-span">
          ${orderPrice}
        </span>

        {returnOrderStatus(orderStatus)}

        <button className="provider-content_orders-content-order-button">
          <Icons id="repeat" />
          Повторить
        </button>

        <button className="provider-content_orders-content-order-button">
          <Icons id="flag" />
          Составить обращение
        </button>
      </div>

      <ProviderOrderItem
        cardSize="XXL"
        cardPrice={100}
        cardTitle="Лонгслив HEATTECH С ХЛОПКОМ"
      />

      <ProviderOrderItem
        cardSize="XXL"
        cardPrice={100}
        cardTitle="Лонгслив HEATTECH С ХЛОПКОМ"
      />

      <ProviderOrderItem
        cardSize="XXL"
        cardPrice={100}
        cardTitle="Лонгслив HEATTECH С ХЛОПКОМ"
      />
    </div>
  );
};

export { ProviderOrderWrapper };
