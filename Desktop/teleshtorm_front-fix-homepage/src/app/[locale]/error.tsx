'use client'

import Link from 'next/link'
import React from 'react'
import styles from './Home.module.scss'


export default function ErrorBoundary() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title_not_found}>Страница не найдена</h2>
      <p className={styles.numbers}>404</p>
      <Link className={styles.link} href={'/'}>На главную</Link>
    </div>
  )
}