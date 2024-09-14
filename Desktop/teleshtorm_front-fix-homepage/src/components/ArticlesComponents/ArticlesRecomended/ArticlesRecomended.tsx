"use client"

import { Article, Category } from '@/app/[locale]/articles/page'
import React, { useEffect, useState } from 'react'
import ArticleCategorySwiper from '../ArticleCategorySwiper/ArticleCategorySwiper'
import RecList from "@/components/ArticlesComponents/ArticleList/ArticleList";
// import Pagination from '@/components/Pagination/Pagination';
import { loadArticles } from '@/app/[locale]/articles/api';
import dynamic from "next/dynamic";

const Pagination = dynamic(() => import("@/components/Pagination/Pagination"));

const ArticlesRecomended = ({
  articles,
  categories,
  accuracyCategory,
  locale
} : {
  articles: Article[]
  categories: Category[],
  accuracyCategory: string,
  locale: string
}) => {
  const [category, setCategory] = useState(accuracyCategory);
  const [filteredArticles, setFilteredArticles] = useState(articles);
  
  function handleClick(catId: string) {
    setCategory(catId);
  }

  useEffect(() => {
    if (category) {
      loadArticles(category).then((data) => {
        setFilteredArticles(data);
      });
    } else {
      setFilteredArticles(articles);
    }
  }, [category]);

  return (
    <>
      <ArticleCategorySwiper categories={categories} currentCategory={category} onClick={handleClick}/>
      <RecList articles={filteredArticles} locale={locale} />
      <Pagination data={filteredArticles}/>
    </>
  )
}

export default ArticlesRecomended