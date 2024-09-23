import { Metadata } from "next";

import { SHOP_NAME } from "@/utils/Consts";

export const metadata: Metadata = {
  title: `Заказы - ${SHOP_NAME}`,
  description: "",
  keywords: "",
  icons: {
    icon: "./public/favicon.ico",
  },
};


export default function OrdersLayout({children}: {children: React.ReactNode}) {
    


  return <div>{children}</div>;
}
