import Link from 'next/link';
import styles from './CategorySlide.module.scss'

interface CategorySlideProps {
  id: string;
  name: string;
  translit_name: string;
  channels_count: number;
  locale: string;
}
export default function CategorySlide({id, name, translit_name, channels_count, locale}: CategorySlideProps) {

  return (
    <div key={id} className={styles.list_item}>
      <Link href={`/${locale}/category/${translit_name}`} className={styles.list_title}>
        {name}
      </Link>
      <p className={styles.list_subscribers}>{channels_count}</p>
    </div>
  );
}
