import React from 'react'
import styles from './ArticleShareButton.module.scss'
import Image from 'next/image'
import Link from 'next/link'

export default function ArticleShareButton() {
  return (
    <Link href={'https://t.me/teleshtorm_com'} className={styles.button}>
        <Image src={'/telegramArticleShare.svg'} width={40} height={40} alt='tg'/>
        <div>
        <h3 className={styles.title}>Подписывайтесь на новости каталога в Telegram</h3>
        <p className={styles.subtitle}>Следите за новостями каталога</p>
        </div>
        </Link>
  )
}
