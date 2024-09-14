import { Popup } from '@/shared/components/Popup'
import styles from './CalculatePopup.module.scss'
import { ContactForm } from '@/features/ContactForm'

export const CalculatePopup = () => {
	return (
		<Popup popupName="calculate">
			<div className={styles.contacts}>
				<ContactForm />
			</div>
		</Popup>
	)
}