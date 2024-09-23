//Global
import React,{lazy} from "react";
//Components
const LogInComponent = lazy(() => import("@/components/LogInComponent/LogInComponent"));
import { Metadata } from "next";
//Utils
import { SHOP_NAME } from "@/utils/Consts";


export const metadata: Metadata = {
  title: `Вход в аккаунт - ${SHOP_NAME}-Партнеры`,
  description: "",
  keywords: "",
  icons: {
    icon: "./public/favicon.ico",
  },
};



export default function LogIn() {
  return <LogInComponent />;
}
