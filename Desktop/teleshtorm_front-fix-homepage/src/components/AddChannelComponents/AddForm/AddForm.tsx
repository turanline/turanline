"use client";

import { CategoryResponse } from "@/app/api/categoryApi";
import cn from "classnames";
import { useTranslations } from "next-intl";
import React from "react";
import ChatForm from "../BotsForm/BotsForm";
import ChannelsForm from "../ChannelsForm/ChannelsForm";
import styles from "./AddForm.module.scss";

const chanelActive = cn(styles._active, styles.button_select);

export default function AddForm({
  category,
}: {
  category: CategoryResponse[];
}) {
  const [acitveSelect, setActiveSelect] = React.useState(true);

  const t = useTranslations("AddForm");
  return (
    <div className={styles.container}>
      <div className={styles.form_container}>
        <h1 className={styles.title}>{t("Заголовок формы")}</h1>
        <p className={styles.subtitle}>{t("Подзаголовок формы")}</p>
        <div className={styles.button_container}>
          <div
            onClick={() => setActiveSelect(true)}
            className={acitveSelect ? chanelActive : styles.button_select}
          >
            {t("Канал")}
          </div>
          <div
            onClick={() => setActiveSelect(false)}
            className={!acitveSelect ? chanelActive : styles.button_select}
          >
            {t("Чат/Бот")}
          </div>
        </div>
        {acitveSelect ? <ChannelsForm category={category} /> : <ChatForm />}
      </div>
      <div className={styles.text_container}>
        <div className={styles.text}>
          <h3 className={styles.quest_title}>{t("Заголовок 1 вопроса")}</h3>
          <p className={styles.quest_subtitle}>{t("Подзаголовок 1 вопроса")}</p>
        </div>
        <div className={styles.text}>
          <h3 className={styles.quest_title}>{t("Заголовок 2 вопроса")}</h3>
          <p className={styles.quest_subtitle}>{t("Подзаголовок 2 вопроса")}</p>
        </div>
      </div>
    </div>
  );
}
