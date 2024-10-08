import Home from "@/components/MainPage/MainPage";
import { SHOP_NAME } from "@/utils/Consts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${SHOP_NAME} - Партнеры`,
  description: "",
  keywords: "",
  icons: {
    icon: "./public/favicon.ico",
  },
};




export default function HomePage() {
  return (
    <div className="main-page">
      <Home/>
    </div>
  );
}