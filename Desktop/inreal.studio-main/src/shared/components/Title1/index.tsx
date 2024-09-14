import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import styles from './Title1.module.scss'

export const Title1 = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
	<h1 className={clsx(className, styles.title1)} {...props}></h1>
)
