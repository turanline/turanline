'use client'
import { useState, CSSProperties, useLayoutEffect } from "react";
import { Icons } from "../Icons/Icons";
import { useTranslate } from "@/hooks/useTranslate";
import { useRouter } from "next/navigation";
//Utils
import { SHOP_WHATSAPP } from "@/utils/Consts";
type Props = {
  status: string;
};

const OrderStatus = ({ status }: Props) => {
  const [orderStatusText, setOrderStatusText] = useState<string>("");
  const [iconId, setIconId] = useState<string>("");
  const translate = useTranslate();
  const {push} = useRouter();
  const [buttonStyles, setButtonStyles] = useState<CSSProperties | undefined>();

  const selectStatusStyles = (status: string) => {
    switch (status) {
      case "FD":
        setOrderStatusText(translate.productStatusDelivered);
        setIconId("deliveredOrder");
        setButtonStyles({
          backgroundColor: "#ECFFFE",
          color: "#0ABAB5",
        });

        break;
      case "CD":
        setOrderStatusText(translate.productStatusBundle);
        setIconId("Packed");
        setButtonStyles({
          backgroundColor: "#FEFFF3",
          color: "#FFD600",
        });

        break;
      case "PR":
        setOrderStatusText(translate.productStatusTransit);
        setIconId("car");
        setButtonStyles({
          backgroundColor: "#fff3fa",
          color: "#e30387",
        });

        break;
      case "CR":
        setOrderStatusText(translate.productStatusCreated);
        setIconId("deliveredOrder");
        setButtonStyles({
          backgroundColor: "#ECFFFE",
          color: "#0ABAB5",
        });

        break;
      case "CT":
          setOrderStatusText(translate.productStatusCargo);
          setIconId("deliveredOrder");
          setButtonStyles({
            backgroundColor: "#ECFFFE",
            color: "#0ABAB5",
          });
  
        break;
      default:
        setOrderStatusText(translate.productStatusUnknown);
        setIconId("car");
        setButtonStyles({
          backgroundColor: "#fff3fa",
          color: "#e30387",
        });

        break;
    }
  };

  
  useLayoutEffect(() => {
    selectStatusStyles(status)
  }, [translate]);




  return (
    <button
      onClick={()=> {status === "CT" ? push(SHOP_WHATSAPP) : null}}
      style={buttonStyles}
      className="provider-content_orders-content-order-status"
    >
      <Icons id={iconId} />
      {orderStatusText}
    </button>
  );
};

export default OrderStatus;
