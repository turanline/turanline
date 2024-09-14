import ChannelsList from "@/components/ChannelsList/ChannelsList";
import { Metadata, ResolvingMetadata } from "next";
import styles from "./index.module.scss";
import AdvertisementCard from "@/components/Cards/AdvertisementCard/AdvertisementCard";
import CardInner from "@/components/Cards/CardInner/CardInner";
import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";
import { getTranslations } from "next-intl/server";
import AdvertisementSwiper from "@/components/AdvertisementSwiper/AdvertisementSwiper";
import { getAdvertisement } from "@/app/api/GetAdvertisement";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const data = await getBots(id);

  const t = await getTranslations("IndexBot");

  return {
    title: `${t("title", { name: data.name })}`,
    description: `${t("description")} ${data.name}. ${data.description}.`,
    keywords: `${t("keywords")}, ${data.name}`,
    robots: {
      index: true,
      follow: true,
    },
  };
}

async function getBots(id: string) {
  const res = await fetch(`${process.env.BASE_URL}/bot/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

async function getSimilarBots(id: string) {
  const res = await fetch(`${process.env.BASE_URL}/bot/${id}/similar_bots`);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return res.json();
}

export default async function BotsCard({
  params: { id },
}: {
  params: { id: string };
}) {
  const data = await getBots(id);
  const similarChannels = await getSimilarBots(id);
  const t = await getTranslations("Card");
  const advertisementData = await getAdvertisement();
  

  return (
    <div className={styles.section}>
      <BreadCrumbs name={data.name} />
      <div className={styles.card_section}>
        <AdvertisementSwiper data={advertisementData}/>
        <CardInner
          id={id}
          hidden={data.hidden}
          category={data.category}
          subscribers={data.subscribers}
          description={data.description}
          link_tg={data.link_tg}
          name={data.name}
          image={data.image}
        />
      </div>
      <div className={styles.advertisement_section}>
        <AdvertisementCard />
        <AdvertisementCard />
      </div>
      <div className={styles.simular_section}>
        <h2 className={styles.title}>{t("Похожие каналы")}</h2>
        <ChannelsList
          advertisement={false}
          path="bots"
          data={similarChannels}
        />
      </div>
    </div>
  );
}
