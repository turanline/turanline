import { ContactCards } from '@/features/ContactCards'
import { Popup } from '@/shared/components/Popup'
import { Title2 } from '@/shared/components/Title2'
import styles from './ContactPopup.module.scss'
import { ContactForm } from '@/features/ContactForm'

export const ContactPopup = () => {
	return (
		<Popup popupName="contact">
			<Title2 className={styles.title}>Контакты</Title2>
			<div className={styles.contacts}>
				<ContactCards />
				<ContactForm />
			</div>
		</Popup>
	)
}