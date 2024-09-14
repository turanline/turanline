"use client";

import React, { useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import styles from "./SwiperMainComponent.module.scss";
import { CategoryResponse } from "@/app/api/categoryApi";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import ChannelSlide from "../Slides/CategorySlide/CategorySlide";
import { AddSquare, ArrowBack, ArrowForward } from "../svgs";
import classNames from "classnames";

type Props = {
  data: CategoryResponse[];
  count: number;
};

const splitToChunks = (categories: CategoryResponse[], locale: string): React.ReactNode[] => {
  const chunkSize = 8;
  const slides: React.ReactNode[] = [];

  for (let i = 0; i < categories?.length; i += chunkSize) {
    const chunk = categories.slice(i, i + chunkSize);

    const slide = (
      <div className={classNames("embla__slide", styles.embla__slide)} key={i}>
        {chunk.map(({ id, name, translit_name, channels_count }) => (
          <ChannelSlide
            key={id}
            name={name}
            id={id}
            translit_name={translit_name}
            channels_count={channels_count}
            locale={locale}
          />
        ))}
      </div>
    );

    slides.push(slide);
  }

  return slides;
};

export default function SwiperMainComponent({ data }: Props) {
  const locale = useLocale();
  const t = useTranslations("Main");
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const slides = useMemo(() => splitToChunks(data, locale), [data, locale]);

  return (
    <div className={styles.section}>
      <div className={styles.subtitle}>
        <div className={styles.subtitle_container}>
          <h3 className={styles.subtitle_text}>{t("Все категории")}</h3>
          <Link href={`/${locale}/add_channel`} className={styles.button_text}>
            <AddSquare className={styles.icon_add} />
            {t("Добавить канал")}
          </Link>
        </div>

        <div className={styles.content}>
          <ArrowBack
            onClick={() => emblaApi && emblaApi.scrollPrev()}
            className={classNames("embla__prev", styles.arrow, styles.arrow_prev)}
          />
          <div className={classNames("embla", styles.embla)} ref={emblaRef}>
            <div className={classNames("embla__container", styles.embla__container)}>
              {slides}
            </div>
          </div>
          <ArrowForward
            onClick={() => emblaApi && emblaApi.scrollNext()}
            className={classNames("embla__next", styles.arrow, styles.arrow_next)}
          />
        </div>
      </div>
    </div>
  );
}
