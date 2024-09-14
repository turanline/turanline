import type { ReactNode } from 'react'
import s from './layout.module.scss'
import { Title3 } from '@/shared/components/Title3'
import { Body1 } from '@/shared/components/Body1'
import { manrope } from '@/global/fonst'
import { wordpress } from '@/shared/api/wordpress'
import clsx from 'clsx'
import { PortfolioCategories } from '@/features/PortfolioCategories/PortfolioCategories'

interface PortfolioPageLayoutProps {
	params: {
		children: ReactNode
		slug: string
	}
	children: ReactNode
}

const PortfolioPageLayout = async ({ params, children }: PortfolioPageLayoutProps) => {
	const [category] = await wordpress.getWorkTypeBySlug(params.slug)

	const tags = category ? await wordpress.getPortfolioTagsByWorkType(category.id) : await wordpress.getPortfolioTags()

	return (
		<div>
			<div className={s.tabHeader}>
				<div className={s.tabHeading}>
					<Title3>{category ? category.name : 'Все'}</Title3>
					<Body1 className={s.tabDescription}>{category ? category.description : 'Все категории'}</Body1>
				</div>
				<div className={clsx(manrope.className, s.tabTags)}>
					<span className={s.tagsTitle}>Категории</span>
					<PortfolioCategories tags={tags} />
				</div>
			</div>

			{children}
		</div>
	)
}

export default PortfolioPageLayout