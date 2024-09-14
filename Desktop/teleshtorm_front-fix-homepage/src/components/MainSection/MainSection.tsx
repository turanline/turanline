import { getTranslations } from "next-intl/server";
import { getCategory } from "../../app/api/categoryApi";
import styles from "./MainSection.module.scss";
import dynamic from "next/dynamic";
const SwiperMainComponent = dynamic(() => import("../SwiperMainComponent/SwiperMainComponent"));

export default async function MainSection() {

  const [data,t] = await Promise.all([getCategory(),getTranslations("Main")]);

  return (
    <div className={styles.main_section}>
      <h2 className={styles.title}>{t("Каталог телеграм каналов")}</h2>
      <SwiperMainComponent count={3} data={data} />
    </div>
  );
}
