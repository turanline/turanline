"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./ArticleCategorySwiper.module.scss";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";

import "swiper/css";

import { useRouter } from "next/navigation";
import classNames from "classnames";
import { Category } from "@/app/[locale]/articles/page";
import { useLocale } from "next-intl";
import Image from "next/image";
import { Navigation } from "swiper/modules";
import { breakpoints } from "./constants";

export default function ArticleCategorySwiper({
  currentCategory,
  categories,
  onClick,
}: {
  currentCategory: string
  categories: Category[],
  onClick: (catId: string) => void
}) {
  const slideRef = useRef<SwiperRef>(null);

  const handlePrev = useCallback(() => {
    if (!slideRef.current) return;
    slideRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!slideRef.current) return;
    slideRef.current.swiper.slideNext();
  }, []);

  const handleClick = (catId: string = "") => {
    onClick(catId === currentCategory ? "" : catId);
  };

  return (
    <section className={styles.section}>
      <div className={classNames(styles.arrow_prev, styles.arrow_prev_active)}>
        <Image
          onClick={handlePrev}
          src={"/arrow-sm.svg"}
          width={10}
          height={12}
          alt="arrow"
        />
      </div>
      <div className={classNames(styles.arrow_next, styles.arrow_next_active)}>
        <Image
          onClick={handleNext}
          src={"/arrow-sm.svg"}
          width={10}
          height={12}
          alt="arrow"
        />
      </div>
      <Swiper
        ref={slideRef}
        onSwiper={(swiper) => {
          if (slideRef.current) {
            slideRef.current.swiper = swiper;
          }
        }}
        breakpoints={breakpoints}
        className={styles.swiper}
        modules={[Navigation]}
      >
        {categories.map((category) => {
          return (
            <SwiperSlide
              key={category.id}
              onClick={() => handleClick(category.id.toString())}
              className={classNames(
                styles.slide,
                currentCategory == category.id.toString() && styles.active
              )}
            >
              <button
                className={styles.link}
              >
                {category.name}
              </button>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}