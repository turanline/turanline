import { CaseProps } from './Case.props'
import styles from './Case.module.scss'
import Link from 'next/link'
import { Popup } from '@/shared/components/Popup'
import { Title2 } from '@/shared/components/Title2'
import { Suspense } from 'react'
import Image from 'next/image'
import { wordpress } from '@/shared/api/wordpress'
import { Share } from '@/features/Share/Share'

const Case = async ({ work, className, categoryName, pageId, categorySlug, searchParams }: CaseProps) => {
	const preview = work.featured_media && await wordpress.getMediaById(+work.featured_media)

	const popupParams = new URLSearchParams({ ...searchParams, modal: work.slug }).toString()

	return (
		<Suspense>
			<div className={className}>
				<Link href={`?${popupParams}`} className={styles.case}>
					<div className={styles.overlay}>
						<span className={styles.card_title} dangerouslySetInnerHTML={{ __html: work.title.rendered }}></span>
						<div className={styles.card_year}>{work.acf.year}</div>
					</div>
					{preview && <>
						<Image
							className={styles.image}
							src={preview.source_url}
							alt="Image didn't load"
							width={680} height={480}
							placeholder="blur"
							blurDataURL="/placeholder_large_dark.jpg"
							loading="lazy"
						/>
						<Image
							className={styles.blur}
							src={preview.source_url}
							alt="Image didn't load"
							width={680} height={480}
							placeholder="blur"
							blurDataURL="/placeholder_large_dark.jpg"
							loading="lazy"
						/></>}
				</Link>
				<Popup popupName={work.slug}>
					<div className={styles.images}>
						{work.acf.preview
							? <video className={styles.image} controls muted>
								<source src={work.acf.preview} />
							</video>
							: preview && <Image
								className={styles.popupImage}
								src={preview.source_url}
								alt="Image didn't load"
								width={1000} height={1000}
								placeholder="blur"
								blurDataURL="/placeholder_large_dark.jpg"
								loading="lazy"
							/>
						}
					</div>
					<div className={styles.header}>
						<span className={styles.category}>{categoryName}</span>
						<Share className={styles.share} />
					</div>
					<Title2 className={styles.popupTitle} dangerouslySetInnerHTML={{ __html: work.title.rendered }}></Title2>
					<div className={styles.content} dangerouslySetInnerHTML={{ __html: work.content.rendered }}></div>
				</Popup>
			</div>
		</Suspense >
	)
}

export default Case

