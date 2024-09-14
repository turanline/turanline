import React from "react";
import styles from "./ChannelsList.module.scss";
import CardWrapper from "../Cards/CardWrapper/CardWrapper";
import AdvertisementCard from "../Cards/AdvertisementCard/AdvertisementCard";
import AdvertisementCardMob, { advertisement } from "../Cards/AdvertisementCardMob/AdvertisementCardMob";
//server
import { GetAdvertisement } from "@/app/api/GetAdvertisement";
//types
type ChannelsListProps = {
  data: Array<{
    id: number;
    name: string;
    subscribers: number;
    image: string;
    description: string;
  }>;
  path?: string;
  advertisement?: boolean;
};


function getRandomAdvertisement(advertisements: advertisement[]) {
  const length = advertisements.length;
  if (length === 0) {
    throw new Error("Advertisements array is empty");
  }
  const randomIndex = Math.floor(Math.random() * length);
  return advertisements[randomIndex];
}

const ChannelsList: React.FC<ChannelsListProps> = async ({ data, path, advertisement }) => {

  let adslist: advertisement[] = [];
  if (advertisement) adslist = await GetAdvertisement();

  const renderAdvsCards = () => advertisement && <AdvertisementCard />;

  const renderCards = () => (
    data?.map((item, index) => (
      <React.Fragment key={item.id}>
        <CardWrapper
          id={item?.id}
          key={item?.id}
          title={item?.name}
          count={item?.subscribers}
          src={item?.image}
          description={item?.description}
          path={path}
        />
        {adslist?.length > 0 && index === 0 && <AdvertisementCardMob data={getRandomAdvertisement(adslist)} />}
      </React.Fragment>
    ))
  )
  

  return (
    <section className={styles.list}>
      {renderAdvsCards()}
      {renderCards()}
    </section>
  );
};

export default ChannelsList;
