"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { advertisement } from "../Cards/AdvertisementCard/AdvertisementCard";
import classNames from "classnames";
import styles from "./AdvertisementSwiper.module.scss";
import AdvertisementCardMob from "../Cards/AdvertisementCardMob/AdvertisementCardMob";

export default function AdvertisementSwiper({
  data,
}: {
  data: advertisement[];
}) {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" });

  return (
    <div className={classNames("embla", styles.embla)} ref={emblaRef}>
      <div className={classNames("embla__container", styles.embla__container)}>
        {data.map((slide) => {
          return <AdvertisementCardMob data={slide} classNames={styles.embla__slide} key={slide.link} />
        })}
      </div>
    </div>
  );
}
