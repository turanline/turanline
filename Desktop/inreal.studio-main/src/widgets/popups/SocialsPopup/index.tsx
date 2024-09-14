import { Popup } from '@/shared/components/Popup'
import styles from './SocialsPopup.module.scss'
import { ContactCards } from '@/features/ContactCards'

export const SocialsPopup = () => {
	return (
		<Popup popupName="socials">
			<ContactCards />
		</Popup>
	)
}