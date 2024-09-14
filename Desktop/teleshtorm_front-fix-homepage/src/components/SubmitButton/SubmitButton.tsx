"use client";
import { useTranslations } from "next-intl";
import styles from "./SubmitButton.module.scss";
import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const t = useTranslations("AddForm");
  const {pending} = useFormStatus()

  return (
    <button type="submit" className={styles.conf_button}>
        {pending ? <span className={styles.loader}></span> : t("Добавить")}
    </button>
  );
}
