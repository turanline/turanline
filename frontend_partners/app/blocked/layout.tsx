import { Metadata } from "next";

import { SHOP_NAME } from "@/utils/Consts";

export const metadata: Metadata = {
  title: `Ваш аккаунт заблокирован - ${SHOP_NAME}-Партнеры`,
  description: "",
  keywords: "",
  icons: {
    icon: "./public/favicon.ico",
  },
};


export default function BlockedLayout({children}: {children: React.ReactNode}) {
    


  return <div>{children}</div>;
}
