"use client"

import Image from "next/image";
import styles from "./ArticleList.module.scss";
import { Article, Articles } from "@/app/[locale]/articles/page";
import Link from "next/link";

export default function ArticleList({ articles, locale  }: { articles: Article[], locale: string }) {
  return (
    <section className={styles.section}>
      {articles.map((article, index) => {
        return (
          <Link href={`/${locale}/articles/${article.translit_name}`} key={index} className={styles.card}>
            <Image className={styles.image} src={article.image} alt="Article" width={356} height={204} loading="eager" priority={true}/>
            <div className={styles.container}>
              <h3 className={styles.title}>{article.name}</h3>
              <p className={styles.text}>{article.description}</p>
            </div>
          </Link>
        );
      })}
    </section>
  );
}
