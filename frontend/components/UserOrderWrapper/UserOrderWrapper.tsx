"use client";
//GLobal
import React, { FC, useState, useRef, useEffect } from "react";
import Link from "next/link";
//Components
import { Icons } from "../Icons/Icons";
import { UserOrderItem } from "@/components/UserOrderItem/UserOrderItem";
//Component Types
import { IUserOrderWrapper } from "@/types/componentTypes";
//styles
import "./UserOrderWrapper.scss";
import { useTranslate } from "@/hooks/useTranslate";
import ModalImport from "../Modals/ModalImport/ModalImport";


const UserOrderWrapper: FC<IUserOrderWrapper> = ({ orderId,orderDate, orderNumber, orderStatus, orderProducts, orderSum }) => {
  const [isHidden, setIsHidden] = useState<boolean>(true);
  const [isOpenReciept,setIsOpenReciept] = useState<boolean>(false);
  const [wrapperHeight, setWrapperHeight] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const translate = useTranslate()


  useEffect(() => {
    setWrapperHeight(contentRef.current?.scrollHeight || null);
  }, [isHidden]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setWrapperHeight(entry.target.scrollHeight + 1);
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
        key={product?.id}
        amount={product?.amount}
        color={product?.color}
        product={product?.product}
        sum={product?.sum}
      />
    ));
  const returnOrderStatus = (status: string) => {
    let orderStatusText, iconId, buttonStyles;

    switch (status) {
      case "FD":
        orderStatusText = translate.productStatusDelivered;
        iconId = "deliveredOrder";
        buttonStyles = {
          backgroundColor: "#ECFFFE",
          color: "#0ABAB5",
        };
        break;

      case "CD":
        orderStatusText = translate.productStatusBundle;
        iconId = "Packed";
        buttonStyles = {
          backgroundColor: "#FEFFF3",
          color: "#FFD600",
        };
        break;

      case "PR":
        orderStatusText = translate.productStatusTransit;
        iconId = "car";
        buttonStyles = {
          backgroundColor: "#fff3fa",
          color: "#e30387",
        };
        break;

      case "CR":
        orderStatusText = translate.productStatusCreated;
        iconId = "deliveredOrder";
        buttonStyles = {
          backgroundColor: "#ECFFFE",
          color: "#0ABAB5",
        };
        break;

      case "CT":
        orderStatusText = translate.productStatusCargo;
        iconId = "deliveredOrder";
        buttonStyles = {
          backgroundColor: "#ECFFFE",
          color: "#0ABAB5",
        };
        break;

      case "OP":
        orderStatusText = translate.productStatusPayment;
          iconId = "Packed";
          buttonStyles = {
            backgroundColor: "#FEFFF3",
            color: "#FFD600",
          };
      break;  

      case "OI":
        orderStatusText = translate.productStatusInspection;
          iconId = "Packed";
          buttonStyles = {
            backgroundColor: "#FEFFF3",
            color: "#FFD600",
          };
      break; 

      case "CL":
        orderStatusText = translate.productStatusClosed;
          iconId = "deliveredOrder";
          buttonStyles = {
            backgroundColor: "#ECFFFE",
            color: "#0ABAB5",
          };
          break;  
      default:
        orderStatusText = translate.productStatusUnknown;
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
    maxHeight: isHidden ? "30px" : `${wrapperHeight}px`,
    transition: "all 0.3s ease-in-out",
  };

  return (
    <div style={wrapperStyles} className="profile-content_orders-content-order-wrapper" ref={contentRef}>
      <div className="profile-content_orders-content-order">
        <span
          className="profile-content_orders-content-order-span"
          onClick={() => setIsHidden(!isHidden)}
        >
          Заказ #{orderNumber}
        </span>

        <span data-date className="profile-content_orders-content-order-span date">
          {returnOrderDate()}
        </span>

        <span className="profile-content_orders-content-order-span sum">
          ${orderSum}
        </span>

          {returnOrderStatus(orderStatus)}

        {
          orderStatus === 'OP' ? (
            <button onClick={()=> setIsOpenReciept(true)} className="profile-content_orders-content-order-button">
              <Icons id="flag" />
              <p>{translate.importTitle}</p>
                
            </button>
          ):(
            <Link target="_" href={`https://wa.me/${'+905525977888'}`} className="profile-content_orders-content-order-button">
              <Icons id="flag" />
              <p>{translate.makeAppealOrders}</p>
            </Link>
          )
        }
      </div>

      {renderOrderProducts()}
      <ModalImport receiptId={orderId} isOpen={isOpenReciept} setIsOpen={setIsOpenReciept}/>
    </div>
  );
};

export { UserOrderWrapper };
