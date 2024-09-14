"use client";

import React, { useEffect, useRef } from "react";
import styles from "./BurgerMenu.module.scss";
import Image from "next/image";
import SearchInput from "../SearchInput/SearchInput";
import classNames from "classnames";
import DropMenu from "../DropMenu/DropMenu";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function BurgerMenu() {
  const [openMenu, setOpenMenu] = React.useState(false);
  const [openSearch, setOpenSearch] = React.useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("BurgerMenu");
  const locale = useLocale();

  useEffect(() => {
    if (openMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [openMenu]);

  useEffect(() => {
    if (!openMenu) return;
    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [openMenu, setOpenMenu]);


  return (
    <nav className={styles.menu}>
      <div
        className={classNames(styles.overlay, !openMenu && styles.hidden)}
      ></div>
      <div
        ref={menuRef}
        className={classNames(styles.burger_menu, !openMenu && styles.hidden)}
      >
        <Link
          href={"/"}
          onClick={() => setOpenMenu(false)}
          className={styles.link}
        >
          {t("Каталог")}
          <Image
            src={"/BurgerIcon.svg"}
            width={14}
            height={10}
            alt={"forward"}
          />
        </Link>
        <Link
          href={`/${locale}/chats`}
          onClick={() => setOpenMenu(false)}
          className={styles.link}
        >
          {t("Чаты")}
          <Image
            src={"/BurgerIcon.svg"}
            width={14}
            height={10}
            alt={"forward"}
          />
        </Link>
        <Link
          href={`/${locale}/bots`}
          onClick={() => setOpenMenu(false)}
          className={styles.link}
        >
          {t("Боты")}
          <Image
            src={"/BurgerIcon.svg"}
            width={14}
            height={10}
            alt={"forward"}
          />
        </Link>
        <Link
          href={`/${locale}/articles`}
          onClick={() => setOpenMenu(false)}
          className={styles.link}
        >
          {t("Статьи")}
          <Image
            src={"/BurgerIcon.svg"}
            width={14}
            height={10}
            alt={"forward"}
          />
        </Link>
        <Link
          href={"https://t.me/teleshtorm_bot"}
          onClick={() => setOpenMenu(false)}
          className={styles.link}
        >
          {t("Поддержка")}
          <Image
            src={"/BurgerIcon.svg"}
            width={14}
            height={10}
            alt={"forward"}
          />
        </Link>
        <Link
          href={"https://t.me/teleshtorm_com"}
          onClick={() => setOpenMenu(false)}
          className={styles.link}
        >
          {t("Наш канал")}
          <Image
            src={"/BurgerIcon.svg"}
            width={14}
            height={10}
            alt={"forward"}
          />
        </Link>
      </div>
      <div className={classNames(styles.left, openSearch && styles.hidden)}>
        <div
          onClick={() => setOpenMenu(!openMenu)}
          className={classNames(styles.burger, openMenu && styles.open)}
        >
          <span></span>
        </div>
        <Link href={"/"}>
          <Image alt="logo" src={"/Logo.svg"} width={50} height={50} />
        </Link>
      </div>
      <div className={styles.right}>
        <Image
          onClick={() => setOpenSearch(!openSearch)}
          src={"/SearchIcon.svg"}
          width={32}
          height={32}
          alt="search"
        />
        <div
          className={classNames(styles.search, !openSearch && styles.hidden)}
        >
          <SearchInput setOpenSearch={setOpenSearch} open={openSearch} />
        </div>
        <DropMenu />
      </div>
    </nav>
  );
}
