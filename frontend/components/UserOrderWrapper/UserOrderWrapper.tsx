"use client";

//GLobal
import React, { FC, useState, useRef, useEffect } from "react";

//Components
import { Icons } from "../Icons/Icons";
import { UserOrderItem } from "@/components/UserOrderItem/UserOrderItem";

//Component Types
import { IUserOrderWrapperProps } from "@/types/componentTypes";

//styles
import "./UserOrderWrapper.scss";

const UserOrderWrapper: FC<IUserOrderWrapperProps> = ({
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

  // const returnOrderStatus = (status: typeof orderStatus) => {

  //   const orderStatusText = status === "processing" ? "В процессе" : "Доставлено";

  //   const iconId = status === "delivered" ? "deliveredOrder" : "car";

  //   const butonStyles = {"backgroundColor": orderStatus === "processing" ? "#fff3fa" : "#ECFFFE", color: orderStatus === "processing" ? "#e30387" : "#0ABAB5",};

  //   return (
  //     <button
  //       style={butonStyles}
  //       className="profile-content_orders-content-order-status"
  //     >
  //       <Icons id={iconId} />

  //       {orderStatusText}
  //     </button>
  //   );
  // };

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
          {orderDate}
        </span>

        <span className="profile-content_orders-content-order-span">
          ${orderPrice}
        </span>

        {/* {returnOrderStatus(orderStatus)} */}

        <button className="profile-content_orders-content-order-button">
          <Icons id="repeat" />
          Повторить
        </button>

        <button className="profile-content_orders-content-order-button">
          <Icons id="flag" />
          Составить обращение
        </button>
      </div>

      <UserOrderItem
        cardSize="XXL"
        cardPrice={100}
        cardTitle="Лонгслив HEATTECH С ХЛОПКОМ"
      />
    </div>
  );
};

export { UserOrderWrapper };
