"use client";
import React from "react";
import styles from "./ArticleInnerContent.module.scss";
import Markdown from "markdown-to-jsx";
import { useTranslations } from "next-intl";

export default function ArticleInnerContent({ content }: { content: string }) {
  const t = useTranslations("Article");

  return (
    <>
      {/* <button
        type="button"
        onClick={() => setShowContent(!showContent)}
        className={styles.button}
      >
        <h3 className={styles.title}>{t('Содержание')}</h3>
        <Image
          src={"/chevron-bar-expand.svg"}
          alt="show"
          width={16}
          height={16}
        />
      </button>
      <div
        className={cn(styles.content, {
          [styles.visible]: showContent,
          [styles.hidden]: !showContent,
        })}
      >
      </div> */}
        <Markdown className={styles.markdown}>{content}</Markdown>
    </>
  );
}
