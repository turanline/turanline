//Components
const Pagination = dynamic(() => import("@/components/Pagination/Pagination"));
const ChannelsList = dynamic(() => import("@/components/ChannelsList/ChannelsList"));
const MainSection = dynamic(() => import("@/components/MainSection/MainSection"));
const NewChannels = dynamic(() => import("@/components/NewChannels/NewChannels"));
const RecList = dynamic(() => import("@/components/RecListMain/RecListMain"));
//Other
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";
//server
import { getChannelsList } from "../actions";
//styles
import styles from "./Home.module.scss";


export async function generateMetadata(): Promise<Metadata> {

  const t = await getTranslations("Index");

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    robots: {
      index: true,
      follow: true,
    },
  };
}


export default async function Home({searchParams,}: {searchParams?: {page?: number;totalPages?: number;};}) {

  const currentPage = Number(searchParams?.page) || 0;

  const [ChannelsData, t] = await Promise.all([
    getChannelsList(currentPage),
    getTranslations("Main")
  ]);

  return (
    <main>
      <h1 className={styles.hidden}>Каталог Telegram-каналов и чатов</h1>
      <MainSection />

      <div className={styles.section}>
        <h2 className={styles.title}>{t("Телеграм каналы")}</h2>
        <ChannelsList advertisement={true} data={ChannelsData} />
      </div>

      <div className={styles.section}>
        <h2 className={styles.title}>{t("Новые каналы")}</h2>
        <NewChannels />
      </div>

      <div className={styles.counter}>
        <Pagination data={ChannelsData} />
        <RecList />
      </div>

    </main>
  );
}