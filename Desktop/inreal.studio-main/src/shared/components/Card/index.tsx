import type { HTMLAttributes } from 'react'
import styles from './Card.module.scss'
import clsx from 'clsx'

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
	return (
		<div className={clsx(styles.card, className)} {...props}></div>
	)
}