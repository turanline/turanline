//Components
import React from "react";
import { notFound } from "next/navigation";

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

//Types
import { IProductsState } from "@/types/types";

//Styles
import "swiper/css";
import "./productPage.scss";
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
    notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const product = await getProductBySlug(params.slug);

    return {
      title: `${product.name}`,
    };
  } catch (error) {
    notFound();
  }
}

export default async function Product({params}: {params: { slug: string }}) {
  async function getProductByParams() {
    try {
      const oneProduct = await getProductBySlug(params.slug);

      if (!oneProduct) notFound();

      return <ProductComponent oneProduct={oneProduct} />;
    } catch (error) {
      notFound();
    }
  }

  async function getSimilarCards() {
    try {
      const similar = await getSimilarProducts(params.slug);

      if (!similar || !similar.length) return null;

      return <ProductPageProducts products={similar} isSimilar={true} />;
    } catch (error) {
      notFound();
    }
  }

  async function getFamousCards() {
    try {
      const famous = await getFamousProducts();

      if (!famous || !famous.length) return null;

      return <ProductPageProducts products={famous} isSimilar={false} />;
    } catch (error) {
      notFound();
    }
  }

  return (
    <main className="container mx-auto mt-[30px] mb-[100px] px-[28px] sm:px-0">
      {getProductByParams()}

      {getSimilarCards()}

      {getFamousCards()}
    </main>
  );
}
