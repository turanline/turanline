"use client";

import { useLocale, useTranslations } from "next-intl";
import styles from "./BreadCrumbs.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function BreadCrumbs({ name, category }: { name?: any, category?: string }) {
  const pathName = usePathname();
  const locale = useLocale();
  const currentPath = pathName
    .split("/")
    .slice(2, -1)
    .map((item) => item.replace("channel", "Каналы"));
  const t = useTranslations("Breadcrumb");


  return (
    <ul className={styles.breadCrumbs}>
      <li className={styles.breadCrumbs_item}>
        <Link className={styles.breadCrumbs_item} href={"/"}>
          {t("Каталог")}
        </Link>
      </li>
      {pathName === `/${locale}/articles` ? (
        <li className={styles.breadCrumbs_item_last}>{t("Статьи")}</li>
      ) : (
        currentPath.map((item, index) => {
          return (
            <li className={styles.breadCrumbs_item} key={index}>
              <Link
                className={styles.breadCrumbs_item}
                href={`/${locale}/${item}`}
              >
                {item === "bots"
                  ? t("Боты")
                  : item === "chats"
                  ? t("Чаты")
                  : t("Статьи")}
              </Link>
            </li>
          );
        })
      )}
      {category && <li className={styles.breadCrumbs_item_last}>{category}</li>}
      {name && <li className={styles.breadCrumbs_item_last}>{name}</li>}
    </ul>
  );
}
