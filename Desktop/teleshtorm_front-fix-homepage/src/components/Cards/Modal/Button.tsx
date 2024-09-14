import styles from './Modal.module.scss'
import { useTranslations } from 'next-intl';

export default function Button({isLoading, isDisabled}: {isLoading: boolean, isDisabled: boolean}) {
  const t = useTranslations("Modal");
  return (
    <button type="submit" className={styles.button} disabled={isDisabled}>
      {isLoading ? <span className={styles.loader}></span> : t('Отправить')}
    </button>
  )
}
