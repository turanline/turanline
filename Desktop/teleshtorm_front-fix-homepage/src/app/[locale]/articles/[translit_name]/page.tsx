import styles from "./HomePage.module.scss";
import ArticleContent from "@/components/ArticlesComponents/ArticleContent/ArticleContent";
import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";
import RecListMain from "@/components/RecListMain/RecListMain";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
  params: { translit_name: string }
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata>{
  const translit_name = params.translit_name
  const data = await getArticle(translit_name)

  const t = await getTranslations("IndexArticle")
  
  return {
    title: `${t("title", { name: data.name })}`,
    description: `${t('description')} ${data.name}. ${data.description}.`,
    keywords: `${t('keywords')}, ${data.name}`,
    robots: {
      index: true,
      follow: true
    },
    openGraph: {
      images: [
        {
          url: data.image,
          type: "article",
        },
      ],
    },
  }
}

export interface Article {
  name: string;
  translit_name: string;
  description: string;
  image: string;
  content: string;
  created_at: string;
  category: Category;
}

export interface Category {
  id: number;
  name: string;
  translit_name: string;
}

async function getArticle(translit_name: string): Promise<Article> {
  try {
    const res = await fetch(`${process.env.BASE_URL}/article/${translit_name}`);
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  } catch (error) {
    console.log(error);
  }
  return undefined as unknown as Article;
}
export default async function HomePage({
  params,
}: {
  params: { translit_name: string };
}) {
  const translit_name = params.translit_name;

  const data: Article = await getArticle(translit_name);

  return (
    <div className={styles.container}>
      <BreadCrumbs name={data.name} />
      <section className={styles.section}>
        <ArticleContent
          image={data.image}
          translit_name={translit_name}
          created_at={data.created_at}
          category={data.category}
          name={data.name}
          description={data.description}
          content={data.content}
        />
        <RecListMain />
      </section>
    </div>
  );
}
