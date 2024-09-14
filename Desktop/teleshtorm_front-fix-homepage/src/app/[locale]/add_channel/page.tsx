import AddForm from "@/components/AddChannelComponents/AddForm/AddForm";
import { getCategory } from "../../api/categoryApi";
import styles from "./AddChannel.module.scss";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("AddChannel");
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    robots: {
      index: true,
      follow: true
    }
  };
}

export default async function AddChannel() {
  const category = await getCategory();
  return (
    <div className={styles.section}>
      <AddForm category={category} />
    </div>
  );
}
