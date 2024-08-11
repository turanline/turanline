"use client";

//GLobal
import React, { FC, useState, useRef, useEffect } from "react";

//Components
import { Icons } from "../Icons/Icons";
import { UserOrderItem } from "@/components/UserOrderItem/UserOrderItem";

//Component Types
import { IUserOrderWrapper } from "@/types/componentTypes";

//styles
import "./UserOrderWrapper.scss";

const UserOrderWrapper: FC<IUserOrderWrapper> = ({
  orderDate,
  orderNumber,
  orderStatus,
  orderProducts,
  orderSum,
}) => {
  const [isHidden, setIsHidden] = useState<boolean>(true),
    [wrapperHeight, setWrapperHeight] = useState<number | null>(null);

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

    if (currentContentRef) resizeObserver.observe(currentContentRef);

    return () => {
      if (currentContentRef) {
        resizeObserver.unobserve(currentContentRef);
      }
    };
  }, []);

  const returnOrderDate = () => {
    const date = new Date(orderDate);

    const day = String(date.getDate()).padStart(2, "0"),
      month = String(date.getMonth() + 1).padStart(2, "0"),
      year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  const renderOrderProducts = () =>
    orderProducts.map(product => (
      <UserOrderItem
        key={product.id}
        amount={product.amount}
        color={product.color}
        product={product.product}
        size={product.size}
      />
    ));

  const returnOrderStatus = (status: string) => {
    let orderStatusText, iconId, buttonStyles;

    switch (status) {
      case "FD":
        orderStatusText = "Доставлено";
        iconId = "deliveredOrder";
        buttonStyles = {
          backgroundColor: "#ECFFFE",
          color: "#0ABAB5",
        };
        break;

      case "CD":
        orderStatusText = "В сборке";
        iconId = "Packed";
        buttonStyles = {
          backgroundColor: "#FEFFF3",
          color: "#FFD600",
        };
        break;

      case "PR":
        orderStatusText = "В пути";
        iconId = "car";
        buttonStyles = {
          backgroundColor: "#fff3fa",
          color: "#e30387",
        };
        break;

      case "CR":
        orderStatusText = "Создан";
        iconId = "deliveredOrder";
        buttonStyles = {
          backgroundColor: "#ECFFFE",
          color: "#0ABAB5",
        };
        break;

      default:
        orderStatusText = "Неизвестный статус";
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
        className="profile-content_orders-content-order-status"
      >
        <Icons id={iconId} />
        {orderStatusText}
      </button>
    );
  };

  const wrapperStyles = {
    maxHeight: isHidden ? "27px" : `${wrapperHeight}px`,
    transition: "max-height 0.3s ease-in-out",
  };

  return (
    <div
      style={wrapperStyles}
      className="profile-content_orders-content-order-wrapper"
      ref={contentRef}
    >
      <div className="profile-content_orders-content-order">
        <span
          className="profile-content_orders-content-order-span"
          onClick={() => setIsHidden(!isHidden)}
        >
          Заказ #{orderNumber}
        </span>

        <span data-date className="profile-content_orders-content-order-span">
          {returnOrderDate()}
        </span>

        <span className="profile-content_orders-content-order-span">
          ${orderSum}
        </span>

        {returnOrderStatus(orderStatus)}

        <button className="profile-content_orders-content-order-button">
          <Icons id="repeat" />
          Повторить
        </button>

        <button className="profile-content_orders-content-order-button">
          <Icons id="flag" />
          Составить обращение
        </button>
      </div>

      {renderOrderProducts()}
    </div>
  );
};

export { UserOrderWrapper };
