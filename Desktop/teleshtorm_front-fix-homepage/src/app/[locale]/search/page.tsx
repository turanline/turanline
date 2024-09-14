import { getCategory } from "@/app/api/categoryApi";
import ChannelsList from "@/components/ChannelsList/ChannelsList";
import RecList from "@/components/RecListMain/RecListMain";
import SwiperMainComponent from "@/components/SwiperMainComponent/SwiperMainComponent";
import { Metadata } from "next";
import styles from "./SearchPage.module.scss";
import { getTranslations } from "next-intl/server";

type Props = {
  searchParams: { term?: string };
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const term = searchParams.term || "";
  const t = await getTranslations("IndexCategory");

  return {
    title: `${t("title", { name: term })}`,
    description: `${t("description", { name: term })}`,
    keywords: `${t("keywords")}${term}`,
    robots: {
      index: true,
      follow: true,
    },
  };
}

async function searchCategory(query: string) {
  const res = await fetch(
    `${process.env.BASE_URL}/channels/search?query=${query}&page=0&limit=31`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { term?: string };
}) {
  const query = searchParams?.term || "";
  const AccurateCategory = await searchCategory(query);
  const categoryList = await getCategory();

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>Поиск телеграм каналов по {query}</h2>
      <SwiperMainComponent count={3} data={categoryList} />
      <div className={styles.channel_section}>
        <ChannelsList path="channel" data={AccurateCategory} />
      </div>
      <RecList />
    </div>
  );
}
