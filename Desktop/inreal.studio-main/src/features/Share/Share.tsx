'use client'

import { Vk } from '@/shared/icons/Vk'
import { Facebook } from '@/shared/icons/Facebook'
import Link from 'next/link'
import { type HTMLAttributes, useEffect, useState } from 'react'
import styles from './Share.module.scss'
import clsx from 'clsx'

const useLocation = () => {
	const [currentLocation, setCurrentLocation] = useState<Location>()

	useEffect(() => {
		setCurrentLocation(location)
	}, [])

	return currentLocation
}

export const Share = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
	const location = useLocation()

	const shareVkLink = `https://vk.com/share.php?url=${location?.href}`
	const shareFacebookLink = `https://www.facebook.com/sharer/sharer.php?u=${location?.href}`

	return (
		<div className={clsx(styles.list, className)} {...props}>
			<Link className={styles.item} href={shareVkLink}>
				<Vk />
			</Link>
			<Link className={styles.item} href={shareFacebookLink}>
				<Facebook />
			</Link>
		</div>
	)
}