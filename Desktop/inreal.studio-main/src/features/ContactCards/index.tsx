import { Card } from '@/shared/components/Card'
import styles from './ContactCards.module.scss'
import { Phone } from '@/shared/icons/Phone'
import Link from 'next/link'
import { Message } from '@/shared/icons/Message'
import { Telegram } from '@/shared/icons/Telegram'

export const ContactCards = () => {
	const { title, contact, header, card } = styles

	return (
		<div className={styles.wrapper}>
			<Link href="tel:88007077653">
				<Card className={card}>
					<div className={header}>
						<span className={title}>Телефон</span>
						<Phone />
					</div>
					<span className={contact}>8 (800) 70-77-653</span>
				</Card>
			</Link>
			<Link href="mailto:info@inreal.studio">
				<Card className={card}>
					<div className={header}>
						<span className={title}>Email</span>
						<Message />
					</div>
					<span className={contact}>info@inreal.studio</span>
				</Card>
			</Link>
			<Link href="https://t.me/INREAL_feedback_bot" target="_blank">
				<Card className={card}>
					<div className={header}>
						<span className={title}>Telegram</span>
						<Telegram />
					</div>
					<span className={contact}>@INREAL_feedback_bot</span>
				</Card>
			</Link>
		</div>
	)
}