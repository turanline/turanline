import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import styles from './Title2.module.scss'

export const Title2 = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
	<h1 className={clsx(className, styles.title2)} {...props}></h1>
)
