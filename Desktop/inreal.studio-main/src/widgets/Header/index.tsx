'use client'

import { Logo } from '@/entities/Logo'
import { Menu } from '@/features/Menu'

import styles from './Header.module.scss'
import Link from 'next/link'
import { Container } from '@/shared/components/Container'
import { useSearchParams } from 'next/navigation'
import clsx from 'clsx'
import { Suspense } from 'react'

const HeaderInner = () => {
	const searchParams = useSearchParams()
	const hideHeader = searchParams.has('modal')

	return (
		<header className={clsx(styles.header, hideHeader && styles.hideHeader)}>
			<Container className={styles.container}>
				<Link prefetch={false} href="/">
				<svg className={styles.logo} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 446.47 212.04">
					<g>
						<rect x="30.72" y="38.38" width="24.16" height="135.27" />
						<polygon points="117.45 118 93.3 38.38 63.34 38.38 63.34 173.65 84.99 173.65 84.99 76.07 114.74 173.65 139.09 173.65 139.09 38.38 117.45 38.38 117.45 118" />
						<path d="M302.01,38.38l-20.97,113.82h-37.82v-37.49h33.24v-21.45h-33.24v-33.43h41.74v-21.45h-65.89v32.66c0-22.03-11.21-32.66-35.75-32.66h-35.75v135.27h24.16v-55.44l19.98,55.44h25.17l-20.46-56.78c15.46-3.42,22.66-13.74,22.66-31.38v88.16h80.63l4.06-25.51h27.44l4.06,25.51h24.54l-25.12-135.27h-32.66ZM171.72,79.95v-20.12h11.21c8.31,0,11.98,4.25,11.98,13.72v7.92c0,10.63-4.83,14.69-14.3,14.69h-8.89v-16.21ZM219.06,81.29s-.08,0-.12,0c.07-1.12.12-2.27.12-3.47v3.48ZM307.23,127.27l10.24-64.35,10.24,64.35h-20.48Z" />
						<polygon points="383.94 152.2 383.94 38.38 359.79 38.38 359.79 173.65 423.75 173.65 423.75 152.2 383.94 152.2" />
					</g>
					<path d="M446.47,212.04H0V0h446.47v212.04ZM6,206.04h434.47V6H6v200.04Z" />
					</svg>
				</Link>
				<Menu />
			</Container>
		</header>
	)
}

export const Header = () => (
	<Suspense fallback={<>Header is loading</>}><HeaderInner /></Suspense>
)