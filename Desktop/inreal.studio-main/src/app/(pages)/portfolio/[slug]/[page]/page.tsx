import { wordpress } from '@/shared/api/wordpress'
import Link from 'next/link'
import { CaseModel } from '@/shared/models/Case.model'
import styles from './page.module.scss'
import Case from '@/entities/Case/Case'
import clsx from 'clsx'

const splitArray = <T,>(numbers: T[], templates: number[]): T[][] => {
	const result: T[][] = []
	let templateIndex = 0
	let currentIndex = 0

	while (currentIndex < numbers.length && templates.length > 0) {
		const currentTemplate = templates[templateIndex % templates.length]
		result.push(numbers.slice(currentIndex, currentIndex + currentTemplate))
		currentIndex += currentTemplate
		templateIndex++
	}

	return result
}

const Portfolio = async ({ params, searchParams }: { params: { page: number, slug: string }, searchParams?: { [key: string]: string } }) => {
	const [category] = await wordpress.getWorkTypeBySlug(params.slug)

	const portfolio = await wordpress.getCases({
		per_page: '12',
		page: params.page ? params.page.toString() : '1',
		...searchParams?.tags && { portfolio_tags: searchParams.tags.split('+').join(',') },
		...params.slug !== 'all' && { work_type: category?.id.toString() }
	})

	const headers = await wordpress.getCasesHeaders({
		per_page: '12',
		page: params.page ? params.page.toString() : '1',
		...searchParams?.tags && { portfolio_tags: searchParams.tags.split('+').join(',') },
		...params.slug !== 'all' && { work_type: category?.id.toString() }
	})

	const cards = splitArray<CaseModel>(portfolio, [6])

	return (
		<>
			<div>
				{cards.map((order, index) =>
					<div key={index} className={styles.portfolioCards}>
						{order.map((item) => <Case
							searchParams={searchParams}
							categorySlug={params.slug}
							pageId={params.page}
							key={item.id}
							work={item}
							categoryName={category ? category.name : 'Все'}
							className={styles.card}
						/>)}
					</div>
				)}
			</div>
			<div className={styles.pagination}>
				{[...Array(+(headers.get('x-wp-totalpages') ? headers.get('x-wp-totalpages')! : 1))].map((_, i) =>
					<Link
						className={clsx(styles.tab, +params.page === i + 1 && styles.active)}
						href={`${i + 1}`}
						key={i + 1}
					>{i + 1}</Link>)}
			</div>
		</>
	)
}

export default Portfolio
