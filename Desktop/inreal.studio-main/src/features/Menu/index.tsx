'use client'

import { Button } from '@/shared/components/Button'
import clsx from 'clsx'
import styles from './Menu.module.scss'
import { useState } from 'react'
import Link from 'next/link'
import { manrope } from '@/global/fonst'

export const Menu = () => {
	const [isOpened, setIsOpened] = useState(false)

	return (
		<>
			<div className={clsx(styles.menu, isOpened && styles.opened)}>
				<nav className={styles.window} onClick={() => { setIsOpened(false) }}>
					<ul className={styles.menuList}>
						<li className={styles.menuItem}>
							<Link className={styles.link} href="/">Главная</Link>
						</li>
						<li className={styles.menuItem}>
							<Link className={styles.link} href="/services">Услуги</Link>
						</li>
						<li className={styles.menuItem}>
							<Link className={styles.link} href="/portfolio">Проекты</Link>
						</li>
						<li className={styles.menuItem}>
							<Link className={styles.link} href="?modal=contact">Контакты</Link>
						</li>
					</ul>
				</nav>
				<nav className={styles.navigation}>
					<Link prefetch={false} className={clsx(styles.menuLink, manrope.className)} href="?modal=socials">контакты</Link>
				</nav>
				<button className={styles.menuButton} onClick={() => { setIsOpened(!isOpened) }}>
					<span className={styles.line} />
					<span className={styles.line} />
					<span className={styles.line} />
				</button>
			</div>
		</>
	)
}