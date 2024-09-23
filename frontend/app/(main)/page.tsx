import Home from "@/components/Home/Home";
import { SHOP_NAME } from "@/utils/Consts";
import { Metadata } from "next";
import '../globals.scss'

export const metadata: Metadata = {
  title: SHOP_NAME,
  description: "",
  keywords: "",
  icons: {
    icon: "./public/favicon.ico",
  },
};

export default function HomePage() {
  return (
    <main className="main-page">
        <Home />
    </main>
  );
}
