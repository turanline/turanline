"use client";

import { CategoryResponse } from "@/app/api/categoryApi";
import cn from "classnames";
import { useTranslations } from "next-intl";
import SubmitButton from "../../SubmitButton/SubmitButton";
import styles from "./ChannelsForm.module.scss";
import { postChannel } from "@/app/actions";
import { useFormState } from "react-dom";

const initialState = {
  message: '',
  status: 0,
}
export default function ChannelsForm({
  category,
}: {
  category?: CategoryResponse[];
}) {
  const t = useTranslations("AddForm");
  const [state, formAction] = useFormState(postChannel, initialState)


  return (
    <>
      <form action={formAction} className={styles.form}>
        <label className={styles.label}>{t("Ссылка на канал")}</label>
        <input
          name="link"
          className={styles.input}
          type="text"
          placeholder={t("Поле ввода")}
        />
        <label className={styles.label}>{t("Категория канала")}</label>
        <select
          defaultValue={category?.[0]?.id}
          className={styles.select}
          name="category"
        >
          {category?.map(({ id, name }) => {
            return (
              <option id={id} value={id} className={styles.option} key={id}>
                {name}
              </option>
            );
          })}
        </select>
         {state.message != '' && (
          <div
            className={cn(styles.msg, {
              [styles.success]: state.status === 200,
              [styles.error]: state?.status !== 200,
            })}
          >
            <h3 className={styles.text_error}>{state.message}</h3>
          </div>
        )}
        <SubmitButton />
      </form>
    </>
  );
}
