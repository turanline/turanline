import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import styles from './Body1.module.scss'
import { manrope } from '@/global/fonst'

export const Body1 = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
	<p className={clsx(manrope.className, className, styles.body1)} {...props}></p>
)
