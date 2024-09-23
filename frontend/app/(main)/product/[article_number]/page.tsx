//Components
import React from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
//Services
import {
  getProductBySlug,
  getAllProducts,
  getFamousProducts,
  getSimilarProducts,
} from "@/services/productsAPI";
//Components
import {ProductComponent} from "@/components/ProductComponent/ProductComponent";
import { ProductPageProducts } from "@/components/ProductPageProducts/ProductPageProducts";
//Redux Types
import { IProductsState } from "@/types/reduxTypes";
//Styles
import "./productPage.scss";

export async function generateStaticParams() {
  const obj: IProductsState["filters"] = {
    brand: null,
    color: null,
    price_max: null,
    price_min: null,
    season: null,
    material: null,
    mold:null,
  };

  try {
    const product = await getAllProducts("Все категории", obj);

    return product?.map(({ article_number }: { article_number: string }) => ({ article_number: article_number }));
  } catch (error) {
    console.error(error);
  }
}

export async function generateMetadata({ params }: { params: { article_number: string }}) {
  try {
    const language = cookies()?.get("selectedLanguage")?.value;
    const selectedLanguage = language ? language : "en";

    const product = await getProductBySlug(params?.article_number, selectedLanguage);

    return {
      title: `${product?.name}`,
    };
  } catch (error) {
    console.error(error);
  }
}

const Product = async ({ params }: { params: { article_number: string }}) => {
  try {
    const language = cookies()?.get("selectedLanguage")?.value;
    const selectedLanguage = language ? language : "en";

    const oneProductPromise = await getProductBySlug(params?.article_number, selectedLanguage);
    const similarProductsPromise = await getSimilarProducts(params?.article_number, selectedLanguage);
    const famousProductsPromise = await getFamousProducts(selectedLanguage);


    if (!oneProductPromise) return notFound();

    return (
      <main className="container mx-auto mb-[100px] px-[15px] lg:px-[30px]">
        <ProductComponent oneProduct={oneProductPromise} />

        {similarProductsPromise?.length > 0 && (
          <ProductPageProducts products={similarProductsPromise} isSimilar={true} />
        )}

        {famousProductsPromise?.length > 0  && (
          <ProductPageProducts products={famousProductsPromise} isSimilar={false} />
        )}
      </main>
    );
  } catch (error) {
    console.error(error);
    return notFound();
  }
};

export default Product;