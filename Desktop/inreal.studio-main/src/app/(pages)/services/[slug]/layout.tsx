import { wordpress } from '@/shared/api/wordpress'
import { Tabs } from '@/shared/components/Tabs/Tabs'
import type { ReactNode } from 'react'
import styles from './layout.module.scss'

const ServiceLayout = async ({ params, children }: { params: { slug: string }, children: ReactNode }) => {
	const services = await wordpress.getServices()

	return (
		<>
			<Tabs className={styles.tabs}
				active={params.slug}
				basePath="/services"
				tabs={services.map(({ title, slug }) => ({ displayName: title.rendered, slug: slug }))}
			/>
			{children}
		</>
	)
}

export default ServiceLayout