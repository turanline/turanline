//Global
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
//Utils
import { PROVIDER_PRODUCTS_ROUTE } from "@/utils/Consts";
//Services
import { getProductBySlug } from "@/services/providerAPI";
//Components
import { EditDynamicCard } from "@/components/EditDynamicCard/EditDynamicCard";
//Styles
import "../../../components/EditDynamicCard/EditDynamicCard.scss";


export async function generateMetadata({params}: {params: { slug: string }}) {
  const language = cookies()?.get("selectedLanguage")?.value;

  try {
    if(language){
      const product = await getProductBySlug(params?.slug, language);


      const title = product?.name ? product?.name : '404';
  
      return {
        title: `Mis Express-Партнеры ${title}`,
      };
    }
  } catch (error) {
     notFound();
  }
}

const ProviderProduct = async ({ params }: { params: { slug: string } }) => {
  async function getProductByParams() {
    try {
    const language = cookies()?.get("selectedLanguage")?.value;
      if(language){
        const oneProduct = await getProductBySlug(params?.slug, language);

        if (!oneProduct) notFound();

        return <EditDynamicCard oneProduct={oneProduct} language={language} />;
      }
    } catch (error) {
      notFound();
    }
  }

  return (
    <div className="container mx-auto mt-[30px] mb-[100px] px-[28px] sm:px-0">
        {getProductByParams()}
    </div>
  );
};

export default ProviderProduct;
