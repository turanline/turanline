import React from "react";
import styles from "./RecListMain.module.scss";
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";
import { getRec } from "@/app/actions";
const SwiperRec = dynamic(() => import("./SwiperRec"));





export default async function RecListMain() {

  const [recData,t] = await Promise.all([getRec(),getTranslations("Main")])


  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t("Рекомендуем почитать")}</h2>
      <SwiperRec data={recData} />
    </div>  
  );
}
