import React from 'react'
import { default as cn} from 'classnames'
import Image from 'next/image'
import styles from "./AdvertisementCardMob.module.scss";
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export interface advertisement {
  title: string;
  content: string;
  image: string;
  link: string;
}

type Props = {
  data: {
    image: string
    title: string
    link: string
    content: string
  },
  classNames?: string
}

const AdvertisementCardMob = ({ data, classNames }: Props) => {
  const { image, title, link, content } = data;
  const t = useTranslations("Card");

  return (
    <article className={cn(styles.ad, classNames)}>
      <Image
        className={styles.image}
        src={image}
        width={94}
        height={94}
        alt={title}
      />
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.descr}>
          {content.split("\n").map((text) => (
            <p key={text} className={styles.descr_item}>
              {text}
            </p>
          ))}
        </div>
        <Link className={styles.link} href={`${link}`}>
          {t("Открыть канал")}
        </Link>
      </div>
      <div className={styles.tag}>#Реклама</div>
    </article>
  )
}

export default AdvertisementCardMob