import styles from "./HomePage.module.scss";

import { Metadata } from "next";
import ArticleSwiper from "@/components/ArticlesComponents/ArticleSwiper/ArticleSwiper";
import { getLocale, getTranslations } from "next-intl/server";
import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";
import { loadArticles, loadCategories, loadRecommendedArticles } from "./api";
import ArticlesRecomended from "@/components/ArticlesComponents/ArticlesRecomended/ArticlesRecomended";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("IndexArticles");
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    robots: {
      index: true,
      follow: true
    }
  };
}

export interface Article {
  name: string;
  translit_name: string;
  description: string;
  image: string;
}

export interface Articles {
  articles: Article[];
}

export interface Category {
  id: number;
  name: string;
  translit_name: string;
  categories: Category[];
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: {
    page?: number;
    category?: string;
  }
}) {
  const currentPage = Number(searchParams?.page) || 0;
  const accuracyCategory = searchParams?.category || '';
  const locale = await getLocale();
  
  const [RecArticles, articles, categories] = await Promise.all([
    loadRecommendedArticles(),
    await loadArticles(accuracyCategory),
    loadCategories()
  ]);

  return (
    <>
      <div className={styles.section}>
        <BreadCrumbs/>
        <ArticleSwiper articles={RecArticles} />
        <ArticlesRecomended articles={articles} categories={categories} accuracyCategory={accuracyCategory} locale={locale} />
      </div>
    </>
  );
}
