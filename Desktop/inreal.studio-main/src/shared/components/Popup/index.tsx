'use client'

import { PopupProps } from './Popup.props'
import { usePathname, useSearchParams } from 'next/navigation'
import styles from './Popup.module.scss'
import clsx from 'clsx'
import Link from 'next/link'

export const Popup = ({ className, popupName, children, ...props }: PopupProps) => {
	const searchParams = useSearchParams()
	const pathname = usePathname()

	const objectParams = Object.fromEntries(searchParams)

	delete objectParams.modal

	const opened = decodeURI(popupName) === searchParams.get('modal')

	return (
		<div className={clsx(styles.popup, opened && styles.opened)} {...props}>
			<Link href={`${pathname}?${new URLSearchParams(objectParams).toString()}`} className={styles.close}>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<g id="Menu / Close_LG" opacity="1">
						<path id="Vector" d="M21 21L12 12M12 12L3 3M12 12L21.0001 3M12 12L3 21.0001" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					</g>
				</svg>
			</Link>
			<div className={styles.window}>
				{children}
			</div>
		</div>
	)
}