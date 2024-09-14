import { useState, useEffect } from "react";
import styles from "./Modal.module.scss";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import Button from "./Button";
import classNames from "classnames";
import { useTranslations } from "next-intl";

export default function Form({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { id } = useParams();
  const pathName = usePathname();
  const type = pathName?.split("/").at(-2);
  const curent_type =
    type === "channel" ? "Канал" : type === "bots" ? "Бот" : "Чат";
  const t = useTranslations("Modal");

  const [msg, setMsg] = useState({
    msg: "",
    status: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formState, setFormState] = useState({
    link_not_work: false,
    drugs: false,
    false_information: false,
    child_abuse: false,
    other: "",
  });

  useEffect(() => {
    const isAnyCheckboxChecked = Object.values(formState).some(
      (value) => value === true
    );
    const isTextareaFilled = formState.other.trim() !== "";
    setIsFormValid(isAnyCheckboxChecked || isTextareaFilled);
  }, [formState]);

  const handleAction = async (formData: FormData) => {
    setIsLoading(true);
    const res = await fetch(`${process.env.BASE_URL}/api/post_complaint`, {
      method: "POST",
      body: formData,
    });

    const { message, status } = await res.json();
    setMsg({ msg: message, status: status });
    setIsLoading(false);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.checked,
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormState((prevState) => ({
      ...prevState,
      other: e.target.value,
    }));
  };

  return (
    <form
      onClick={(e) => e.stopPropagation()}
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        handleAction(new FormData(e.target as HTMLFormElement));
      }}
    >
      <div className={styles.text_container}>
        <p className={styles.title}>{t('Опишите причину жалобы')}</p>
        <Image
          onClick={() => setOpen(false)}
          style={{ cursor: "pointer" }}
          src={"/Close.svg"}
          alt="close"
          width={15}
          height={15}
        />
      </div>
      <ul className={styles.options}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="type" value={curent_type} />
        <li className={styles.option}>
          <input
            type="checkbox"
            id="link_not_work"
            name="link_not_work"
            className={styles.input}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="link_not_work" className={styles.label}>
            {t('Ссылка на телеграм канал/чат/бот не работает')}
          </label>
        </li>
        <li className={styles.option}>
          <input
            type="checkbox"
            id="drugs"
            name="drugs"
            className={styles.input}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="drugs" className={styles.label}>
            {t('Пропаганда наркотиков')}
          </label>
        </li>
        <li className={styles.option}>
          <input
            type="checkbox"
            id="false_information"
            name="false_information"
            className={styles.input}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="false_information" className={styles.label}>
            {t('Ложная информация')}
          </label>
        </li>
        <li className={styles.option}>
          <input
            type="checkbox"
            id="child_abuse"
            name="child_abuse"
            className={styles.input}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="child_abuse" className={styles.label}>
            {t('Жестокое обращение с детьми')}
          </label>
        </li>
      </ul>
      <h3 className={styles.subtitle}>{`${t('Другое')}:`}</h3>
      <textarea
        onClick={(e) => e.stopPropagation()}
        name="other"
        className={styles.text_area}
        onChange={handleTextareaChange}
      ></textarea>
      {msg.msg != "" && (
        <div
          className={classNames(styles.msg, {
            [styles.success]: msg.status === 200,
            [styles.error]: msg?.status !== 200,
          })}
        >
          <h3 className={styles.text_error}>{msg.msg}</h3>
        </div>
      )}
      <Button isLoading={isLoading} isDisabled={!isFormValid} />
    </form>
  );
}
