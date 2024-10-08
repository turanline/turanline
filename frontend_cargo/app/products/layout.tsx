import { Metadata } from "next";

import { SHOP_NAME } from "@/utils/Consts";

export const metadata: Metadata = {
  title: `Товары и цены - ${SHOP_NAME}`,
  description: "",
  keywords: "",
  icons: {
    icon: "./public/favicon.ico",
  },
};


export default function ProductsLayout({children}: {children: React.ReactNode}) {
    


  return <div>{children}</div>;
}
