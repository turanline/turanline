"use client";

import classNames from "classnames";
import { useTranslations } from "next-intl";
import SubmitButton from "../../SubmitButton/SubmitButton";
import styles from "./BotsForm.module.scss";
import { postBots } from "@/app/actions";
import { useFormState } from "react-dom";

export default function BotsForm() {
  const t = useTranslations("AddForm");
  const [state,formAction] = useFormState(postBots, {
    message: "",
    status: 0,
  })
  

  return (
    <form action={formAction} className={styles.form}>
      <label className={styles.label}>{t("Ссылка на канал")}</label>
      <input
        name="link"
        className={styles.input}
        type="text"
        placeholder={t("Поле ввода")}
      />
      {state.message != '' && (
          <div
            className={classNames(styles.msg, {
              [styles.success]: state.status === 200,
              [styles.error]: state?.status !== 200,
            })}
          >
            <h3 className={styles.text_error}>{state.message}</h3>
          </div>
        )}
      <SubmitButton />
    </form>
  );
}
