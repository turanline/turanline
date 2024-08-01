//Components
import React from "react";
import { cookies } from "next/headers";

//Services
import {
  getProductBySlug,
  getAllProducts,
  getFamousProducts,
  getSimilarProducts,
} from "@/services/productsAPI";

//Components
import { ProductComponent } from "@/components/ProductComponent/ProductComponent";
import { ProductPageProducts } from "@/components/ProductPageProducts/ProductPageProducts";

//Redux Types
import { IProductsState } from "@/types/reduxTypes";

//Styles
import "./productPage.scss";
import "swiper/css";
import "swiper/css/pagination";

export async function generateStaticParams() {
  const obj: IProductsState["filters"] = {
    brand: null,
    color: null,
    hbprice: null,
    lbprice: null,
    size: null,
  };

  try {
    const product = await getAllProducts("Все категории", obj);

    return product.map(({ slug }: { slug: string }) => ({
      slug: slug,
    }));
  } catch (error) {
    console.error(error);
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const data = cookies()?.get("selectedLanguage")?.value,
      language = data ? data : "en";

    const product = await getProductBySlug(params.slug, language);

    return {
      title: `${product.name}`,
    };
  } catch (error) {
    console.error(error);
  }
}

export default async function Product({
  params,
}: {
  params: { slug: string };
}) {
  async function getProductByParams() {
    try {
      const data = cookies()?.get("selectedLanguage")?.value,
        language = data ? data : "en";

      const oneProduct = await getProductBySlug(params.slug, language);

      if (oneProduct) return <ProductComponent oneProduct={oneProduct} />;
    } catch (error) {
      console.error(error);
    }
  }

  async function getSimilarCards() {
    try {
      const similar = await getSimilarProducts(params.slug);

      if (!similar || !similar.length) return null;

      return <ProductPageProducts products={similar} isSimilar={true} />;
    } catch (error) {
      console.error(error);
    }
  }

  async function getFamousCards() {
    try {
      const famous = await getFamousProducts();

      if (!famous || !famous.length) return null;

      return <ProductPageProducts products={famous} isSimilar={false} />;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="container mx-auto mt-[30px] mb-[100px] px-[28px] sm:px-0">
      {getProductByParams()}

      {getSimilarCards()}

      {getFamousCards()}
    </div>
  );
}
