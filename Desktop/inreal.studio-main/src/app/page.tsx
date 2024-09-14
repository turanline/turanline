import { HomeBackground } from '@/widgets/HomeBackground'

import styles from './page.module.scss'
import clsx from 'clsx'
import { manrope } from '@/global/fonst'
import { Button } from '@/shared/components/Button'
import Link from 'next/link'
import { Suspense } from 'react'
import { Header } from '@/widgets/Header'

export default function HomePage() {
  const { overlay, label, title } = styles;

  return (
    <>
      <Header />
      <Suspense>
        <div className={overlay} data-prevent-header>
          <div className={title}>
            <span className={clsx(label, manrope.className)}>Креатив в 3D</span>
          </div>
          <Link prefetch={false} href="/portfolio">
            <Button appearance="secondary" size="large" className={styles.portfolioButton}>смотреть работы</Button>
          </Link>
        </div>
    
        <HomeBackground />
      </Suspense>
    </>
  )
}
