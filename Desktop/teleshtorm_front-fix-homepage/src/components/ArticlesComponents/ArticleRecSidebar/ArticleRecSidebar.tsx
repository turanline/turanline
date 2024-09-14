import Image from "next/image";
import React from "react";
import styles from "./ArticleRecSidebar.module.scss";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

export interface recArticle {
  name: string;
  translit_name: string;
  description: string;
  image: string;
}

async function getRec(): Promise<recArticle[]> {
  const res = await fetch(`${process.env.BASE_URL}/articles/recommended`);
  if (res.ok) {
    return res.json();
  }
  throw new Error(res.statusText);
}

export default async function ArticleRecSidebar({
  translit_name,
}: {
  translit_name: string;
}) {
  const locale = await getLocale();
  const articles = await getRec();
  const t = await getTranslations("Article");
  const href = `/${locale}/articles/${translit_name}`;

  return (
    <div className={styles.container}>
      <div className={styles.article_container}>
        <h2 className={styles.title}>{t("Рекомендуем статьи")}</h2>
        {articles.map(({ image, name }, index) => {
          return (
            <Link className={styles.article} key={index} href={href}>
              <Image
                className={styles.image}
                src={image}
                width={297}
                height={170}
                alt="image"
              />
              <p className={styles.text}>{name}</p>
            </Link>
          );
        })}
      </div>

      <div className={styles.links_container}>
        <Link
          className={styles.link}
          href={`/${locale}/articles/${translit_name}/#`}
        >
          <Image src={"/Share.svg"} width={21} height={19} alt={"share"} />
          {t("Поделиться")}
        </Link>
        <div className={styles.links}>
          <Link
            href={`https://vkontakte.ru/share.php?url=${href}`}
            className={styles.vk}
          />
          <Link
            href={`https://telegram.me/share/url?url=${href}`}
            className={styles.TG}
          />
          <Link
            href={`https://twitter.com/intent/tweet?text=${href}`}
            className={styles.Twitter}
          />

          <Link href={href} className={styles.FaceBook} />
        </div>
      </div>
    </div>
  );
}
