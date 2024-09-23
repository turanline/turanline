const CreateNewProductComponent = lazy(() => import("@/components/CreateNewProduct/CreateNewProductComponent"));
import { lazy } from "react";
import { Metadata } from "next";
//Utils
import { SHOP_NAME } from "@/utils/Consts";
//Styles
import './createNewProduct.scss';

export const metadata: Metadata = {
  title: `Добавить товар - ${SHOP_NAME}-Партнеры`,
  description: "",
  keywords: "",
  icons: {
    icon: "./public/favicon.ico",
  },
};

const createNewProduct = () => {

  return(
    <main className="container mx-auto mt-[30px] mb-[100px] sm:px-0">
        <CreateNewProductComponent/>
    </main>
  )
}

export default createNewProduct;