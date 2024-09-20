//Global
import React from "react";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
//Services
import { getProductBySlug } from "@/services/providerAPI";
//Components
import { EditDynamicCard } from "@/components/EditDynamicCard/EditDynamicCard";
//Styles
import "../../../components/EditDynamicCard/EditDynamicCard.scss";


export async function generateMetadata({params}: {params: { article_number: string }}) {
  const language = cookies()?.get("selectedLanguage")?.value;
    
  try {
    if(language){
      const product = await getProductBySlug(params?.article_number, language);


      const title = product?.name ? product?.name : '404';
  
      return {
        title: `Mis Express-Партнеры ${title}`,
      };
    }
  } catch (error) {
     notFound();
  }
}

const ProviderProduct = async ({ params }: { params: { article_number: string } }) => {

  async function getProductByParams() {
    try {
    const language = cookies()?.get("selectedLanguage")?.value;
    const selectedLanguage = language ? language : "en";

      if(selectedLanguage){
        const oneProduct = await getProductBySlug(params?.article_number, selectedLanguage);

        if (!oneProduct) notFound();

        return <EditDynamicCard oneProduct={oneProduct} language={selectedLanguage} />;
      }
    } catch (error) {
      notFound();
    }
  }

  return (
    <div className="container mx-auto mt-[30px] mb-[100px] px-[15px] sm:px-0">
        {getProductByParams()}
    </div>
  );
};

export default ProviderProduct;
