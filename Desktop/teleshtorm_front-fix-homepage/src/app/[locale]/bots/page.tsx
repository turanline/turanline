import ChannelsList from "@/components/ChannelsList/ChannelsList";
import styles from "./BotsPage.module.scss";

// import Pagination from "@/components/Pagination/Pagination";
import RecList from "@/components/RecListMain/RecListMain";
// import { getTotalPages } from "@/helpers/getTotalPages";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";

const Pagination = dynamic(() => import("@/components/Pagination/Pagination"));

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("IndexBots");
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

async function getBotsList(page: number) {
  try {
    const res = await fetch(`${process.env.BASE_URL}/bots?page=${page}&limit=31`);
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  } catch(error) {
    console.log(error);
  }

  return [];
}

export default async function BotsPage({
  searchParams,
}: {
  searchParams?: {
    page?: number;
  };
}) {
  const currentPage = Number(searchParams?.page) || 1;

  const data = await getBotsList(currentPage > 1 ? currentPage : 0);

  const t = await getTranslations("Bots");
  return (
    <>
      <h2 className={styles.title}>{t("Каталог телеграм ботов")}</h2>
      <div style={{ marginBottom: "15px" }} className={styles.section}>
        <h3 className={styles.subtitle}>{t("Телеграм боты")}</h3>
        <ChannelsList path="bots" data={data} />
      </div>
      <Pagination data={data} />
      <div style={{ paddingInline: "12px" }}>
        <RecList />
      </div>
    </>
  );
}
