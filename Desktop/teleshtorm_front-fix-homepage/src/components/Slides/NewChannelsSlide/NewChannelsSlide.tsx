import Link from "next/link";
import styles from "./NewChannelsSlide.module.scss";
import Image from "next/image";
import React from "react";

interface SlideRes {
  id: number;
  name: string;
  image: string;
  subscribers: number;
  locale: string;
}

const NewChannelsSlide: React.FC<SlideRes> = React.memo(({ id, name, image, subscribers, locale }) => {
  return (
    <Link href={`/${locale}/${id}`} className={styles.item}>
      <Image
        width={46}
        height={46}
        src={image}
        alt={name}
        className={styles.image}
        loading="lazy"
      />
      <div className={styles.text_container}>
        <p className={styles.title}>{name}</p>
        <p className={styles.description}>{subscribers?.toLocaleString()} подписчиков</p>
      </div>
    </Link>
  );
});

NewChannelsSlide.displayName = 'NewChannelsSlide';

export default NewChannelsSlide;
