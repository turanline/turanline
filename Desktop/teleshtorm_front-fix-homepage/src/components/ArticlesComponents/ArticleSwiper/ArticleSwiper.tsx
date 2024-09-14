"use client";

import { useRef } from "react";
import styles from "./ArticleSwiper.module.scss";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Image from "next/image";
import { Articles } from "@/app/[locale]/articles/page";
import "./pagination.css";

import "swiper/css";
import Link from "next/link";
import { useLocale } from "next-intl";

export default function ArticleSwiper({ articles }: Articles) {
  const AsliderRef = useRef<SwiperRef>(null);
  const locale = useLocale();

  return (
    <div className={styles.section}>
      <Swiper
        ref={AsliderRef}
        onSwiper={(swiper) => {
          if (AsliderRef.current) {
            AsliderRef.current.swiper = swiper;
          }
        }}
        slidesPerView={1}
        spaceBetween={10}
        pagination={{ clickable: true}}
        modules={[Pagination]}
        className={styles.swiper_article}
      >
        {articles.map((article, index) => {
          return (
            <SwiperSlide className={styles.slide_article} key={index}>
              <Link
                className={styles.slide_article}
                href={`/${locale}/articles/${article.translit_name}`}
              >
                <Image
                  className={styles.image}
                  width={460}
                  height={260}
                  alt="article"
                  src={article.image}
                  loading="eager"
                  priority={true}
                />
                <div className={styles.container}>
                  <h2 className={styles.title}>{article.name}</h2>
                  <p className={styles.subtitle}>{article.description}</p>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className="swiper-pagination"></div>
    </div>
  );
}
