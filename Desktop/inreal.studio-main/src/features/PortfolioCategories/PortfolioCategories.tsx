'use client'

import { useRouter } from 'next/navigation'
import styles from './PortfolioCategories.module.scss'
import { PortfolioTagModel } from '@/shared/models/PortfolioTag.model'

export const PortfolioCategories = async ({ tags }: { tags: PortfolioTagModel[] }) => {
	const { push } = useRouter()

	return (
		<ul className={styles.tags}
			onClick={() => {
				const list = document.querySelector(`.${styles.tags}`)
				const tags = list?.querySelectorAll('input[type=checkbox]:checked')

				if (tags?.length && tags.length > 0) {
					const Tags = Array.from(tags).map((tag) => (tag.parentNode as HTMLElement)?.getAttribute('data-tag'))

					push(`?tags=${Tags.join('+')}`)
				}
				else {
					push('?')
				}
			}}>
			{tags.map((item) =>
				<li className={styles.tag} data-tag={item.id} key={JSON.stringify(item)}>
					<input className={styles.input} type="checkbox" name={item.id.toString()} id={item.slug} />
					<label className={styles.label} htmlFor={item.slug}>{item.name}</label>
				</li>
			)}
		</ul>
	)
}