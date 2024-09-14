import { Container } from '@/shared/components/Container'
import { Title1 } from '@/shared/components/Title1'
import { Suspense, type ReactNode } from 'react'
import styles from './layout.module.scss'
import { wordpress } from '@/shared/api/wordpress'
import { Tabs } from '@/shared/components/Tabs/Tabs'
import { Metadata } from 'next'

export const generateMetadata = async ({ params }: { params: { slug: string } }): Promise<Metadata> => {
	const [category] = await wordpress.getWorkTypeBySlug(params.slug)

	return category
		? {
			title: `${category.name} - inReal.studio`,
			description: `${category.description}`,
			openGraph: {
				title: `${category.name} - inReal.studio`,
				description: `${category.description}`,
				url: `https://www.inreal.studio/portfolio/${params.slug}`
			}
		}
		: {
			title: `Все работы - inReal.studio`,
			description: `Все работы`,
			openGraph: {
				title: `Все работы - inReal.studio`,
				description: `Все работы`,
				url: `https://www.inreal.studio/portfolio/${params.slug}`
			}
		}
}

const Layout = async ({ children, params }: { children: ReactNode, params: { slug: string } }) => {
	const categories = await wordpress.getWorkTypes()

	return (
		<Suspense fallback={<>Подождите...</>}>
			<div className={styles.portfolio}>
				<Container className={styles.container}>
					<Title1 className={styles.title}>Проекты</Title1>
					<Tabs className={styles.tabs} active={params.slug} basePath="/portfolio"
						tabs={[
							{ displayName: 'Все', slug: 'all' },
							...categories.map((category) => ({ displayName: category.name, slug: category.slug }))
						]} />
					{children}
				</Container>
			</div>
		</Suspense>
	)
}

export default Layout