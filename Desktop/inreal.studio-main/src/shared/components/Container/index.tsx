import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import styles from './Container.module.scss'

export const Container = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
	<div className={clsx(className, styles.container)} {...props}></div>
)