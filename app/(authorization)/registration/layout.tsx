import { Metadata } from "next";
import { SHOP_NAME } from "@/utils/Consts";

export const metadata: Metadata = {
  title: `Регистрация - ${SHOP_NAME}-Партнеры`,
  description: "",
  keywords: "",
  icons: {
    icon: "./public/favicon.ico",
  },
};


export default function RegistrationLayout({children}: {children: React.ReactNode}) {
    


  return <div>{children}</div>;
}
