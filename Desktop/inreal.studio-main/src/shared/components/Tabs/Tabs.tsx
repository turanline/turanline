import clsx from 'clsx'
import styles from './Tabs.module.scss'
import { TabsProps } from './Tabs.props'
import Link from 'next/link'

export const Tabs = ({ tabs, basePath, active, className, ...props }: TabsProps) => {
	return (
		<div className={clsx(className, styles.tabs, tabs.length >= 3 && styles.between)} {...props}>
			{tabs.map((tab) => (
				<Link key={tab.slug} className={clsx(styles.tab, active === tab.slug && styles.active)} href={`${basePath}/${tab.slug}`}>{tab.displayName}</Link>
			))}
		</div>
	)
}