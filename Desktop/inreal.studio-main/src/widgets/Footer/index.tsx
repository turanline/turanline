import { Container } from '@/shared/components/Container'
import styles from './Footer.module.scss'
import { Logo } from '@/entities/Logo'
import Link from 'next/link'
import { Card } from '@/shared/components/Card'
import { Message } from '@/shared/icons/Message'
import { Telegram } from '@/shared/icons/Telegram'
import clsx from 'clsx'
import { manrope } from '@/global/fonst'

export const Footer = () => {
	return (
		<Container className={clsx(styles.footer, manrope.className)}>
			<div className={styles.footerMain}>
				<div className={styles.footerBlock}>
					<Logo />
				</div>
				<div className={styles.footerBlock}>
					<p className={styles.contact}>
						Свяжитесь с нами и мы рассчитаем полную стоиммость вашего проекта
					</p>
					<Link href="tel:88007077653" className={styles.number}>8 (800) 70-77-653</Link>
				</div>
				<div className={styles.cards}>
					<Link className={styles.card} href="mailto:info@inreal.studio">
						<Card className={styles.cardItem}>
							<span className={styles.title}>Получить коммерческое предложение</span>
							<span className={styles.label}>по email</span>
							<div className={styles.iconCtn}>
								<Message />
							</div>
						</Card>
					</Link>
					<Link className={styles.card} href="https://t.me/INREAL_feedback_bot" target="_blank">
						<Card className={styles.cardItem}>
							<span className={styles.title}>Обсудить проект</span>
							<span className={styles.label}>в telegram</span>
							<div className={styles.iconCtn}>
								<Telegram />
							</div>
						</Card>
					</Link>
				</div>
			</div>
			<div className={styles.footerLegals}>
				<span className={styles.legalsTitle}>2024© inreal studio</span>
				<Link prefetch={false} href="/policy" className={styles.link}>политика в отношении обработки персональных данных</Link>
				<span className={styles.legalsTitle}></span>
			</div>
		</Container>
	)
}