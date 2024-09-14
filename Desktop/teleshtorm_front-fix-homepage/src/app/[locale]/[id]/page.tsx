import ChannelsList from "@/components/ChannelsList/ChannelsList"
import { Metadata } from "next";
import styles from './ChannelCard.module.scss'
import AdvertisementCard from "@/components/Cards/AdvertisementCard/AdvertisementCard";
import CardInner from "@/components/Cards/CardInner/CardInner";
import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";
import { getTranslations } from "next-intl/server";
import { getAdvertisement } from "@/app/api/GetAdvertisement";
import AdvertisementSwiper from "@/components/AdvertisementSwiper/AdvertisementSwiper";

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata>{
  const id = params.id
  const data = await getCard(id)

  const t = await getTranslations("IndexChannel")
  
  return {
    title: `${t("title", { name: data.name })}`,
    description: `${t('description')} ${data.name}. ${data.description}.`,
    keywords: `поиск, каталог, телеграм, telegram, канал, ${data.name}`,
    robots: {
      index: true,
      follow: true
    }
  }
}

 
async function getCard(id: string) {
  const res = await fetch(`${process.env.BASE_URL}/channel/${id}`)
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

async function getSimilarChannels(id: string) {
  const res = await fetch(`${process.env.BASE_URL}/channel/${id}/similar_channels`)
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  return res.json()
}

export default async function ChannelCard({ params: { id } }:{
  params: { id: string }
}) {
  
  const data = await getCard(id)
  const similarChannels = await getSimilarChannels(id)
  const t = await getTranslations("Card")
  const advertisement = await getAdvertisement()

  return <div className={styles.section}>
    <BreadCrumbs name={data.name}/>
    
    <div className={styles.card_section}>
      <AdvertisementSwiper data={advertisement}/>
      <CardInner hidden={data.hidden} category={data.category} subscribers={data.subscribers} description={data.description} link_tg={data.link_tg} name={data.name} id={id} image={data.image}/>
    </div>
    <div className={styles.advertisement_section}>
    <AdvertisementCard />
    <AdvertisementCard />
    </div>
    <div className={styles.simular_section}>
      <h2 className={styles.title}>{t('Похожие каналы')}</h2>
      <ChannelsList advertisement={false} data={similarChannels}/>
    </div>
  </div>;
}
