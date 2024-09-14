import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import styles from './Title3.module.scss'

export const Title3 = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
	<h3 className={clsx(className, styles.title3)} {...props}></h3>
)
