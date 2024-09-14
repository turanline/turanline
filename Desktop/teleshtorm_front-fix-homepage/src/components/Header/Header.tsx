import styles from "./Header.module.scss";
import { CatalogLogo, Logo, StaticLogo, ChatsLogo, BotsLogo } from "../svgs";
import SearchInput from "../SearchInput/SearchInput";
import DropMenu from "../DropMenu/DropMenu";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function Header() {
  const locale = useLocale();
  const t = useTranslations('Header')
  
  return (
    <header className={styles.header}>
      <div className={styles.container_inner}>
      <div className={styles.header_container}>
        <nav className={styles.menu_container}>
          <Link locale={locale} href={`/${locale}`} className={styles.logo}>
            <Logo className={styles.logo} />
          </Link>
          <Link href={"/"} className={styles.menu_item}>
            <CatalogLogo className={styles.item_icon} />
            <p className={styles.title}>
              {t('Каталог')}
            </p>
          </Link>
          <Link href={`/${locale}/chats`} className={styles.menu_item}>
            <ChatsLogo className={styles.item_icon} />
            <p className={styles.title}>{t('Чаты')}</p>
          </Link>
          <Link href={`/${locale}/bots`} className={styles.menu_item}>
            <BotsLogo className={styles.item_icon} />
            <p className={styles.title}>{t('Боты')}</p>
          </Link>
          <Link href={`/${locale}/articles`} className={styles.menu_item}>
            <StaticLogo className={styles.item_icon} />
            <p className={styles.title}>{t('Статьи')}</p>
          </Link>
        </nav>

        <div className={styles.search_container}>
          <SearchInput />
          <DropMenu />
        </div>
      </div>
      </div>
    </header>
  );
}
