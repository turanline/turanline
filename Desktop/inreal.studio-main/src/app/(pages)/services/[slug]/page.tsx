import { wordpress } from '@/shared/api/wordpress'
import { Title3 } from '@/shared/components/Title3'
import styles from './page.module.scss'
import { Body1 } from '@/shared/components/Body1'
import { Button } from '@/shared/components/Button'
import Image from 'next/image'
import clsx from 'clsx'
import { Share } from '@/features/Share/Share'
import { Metadata } from 'next'
import Case from '@/entities/Case/Case'
import Link from 'next/link'

export const generateMetadata = async ({ params }: { params: { slug: string } }): Promise<Metadata> => {
	const [service] = await wordpress.getServiceBySlug(params.slug)
	const image = service.featured_media && await wordpress.getMediaById(service.featured_media)

	return {
		title: `${service.title.rendered} - inReal.studio`,
		description: `${service.acf.excerpt}`,
		openGraph: {
			title: `${service.title.rendered} - inReal.studio`,
			description: `${service.acf.excerpt}`,
			url: `https://www.inreal.studio/services/${params.slug}`,
			...image && { images: [image.source_url] }
		}
	}
}

const ServicePage = async ({ params }: { params: { slug: string } }) => {
	const [service] = await wordpress.getServiceBySlug(params.slug)
	const portfolio = service.acf.portfolio_category && await wordpress.getCases({
		work_type: service.acf.portfolio_category.toString(),
		per_page: '4'
	})
	const category = service.acf.portfolio_category && await wordpress.getWorkTypeById(service.acf.portfolio_category)

	return (
		<>
			<Title3 className={styles.title}>{service.title.rendered}</Title3>
			<span className={styles.subtitle}>{service.acf.subtitle}</span>
			<div className={styles.buttonWrapper}>
				<Link className={styles.fixed} href="?modal=calculate">
					<Button className={styles.button} appearance="secondary" size="large">Рассчитать стоимость</Button>
				</Link>
			</div>
			<div className={clsx(styles.block, styles.mainDescription)}>
				<div className={styles.content}>
					<Body1>{service.acf.excerpt}</Body1>
				</div>
				<div className={styles.side}>
				</div>
			</div>
			<span className={styles.label}>Создаем</span>
			<div className={styles.worksRange}>
				{service.acf.range_of_work.map((type) => (
					<div key={JSON.stringify(type)} className={styles.workType}>
						<Image className={styles.image} src={type.image} alt={type.title} width={300} height={300} />
						<div className={styles.overlay}>
							<span className={styles.title}>{type.title}</span>
						</div>
					</div>
				))}
			</div>
			<video className={styles.video} autoPlay loop muted>
				<source src={service.acf.video} />
			</video>
			<div className={clsx(styles.block, styles.reverse, styles.toolsDescription)}>
				<div className={styles.content}>
					<Body1 className={styles.tools_description}>{service.acf.tools_description}</Body1>
				</div>
				<div className={styles.side}>
					<Share className={styles.share} />
				</div>
			</div>
			<div className={clsx(styles.block, styles.toolsLogos)}>
				<div className={styles.content}>
					<div className={styles.logos}>
						{service.acf.tools.map((tool) =>
							<div key={tool} className={styles.logo}>
								<Image className={styles.image} src={tool} alt={tool} width={250} height={90} />
							</div>
						)}
						<Body1 className={styles.serviceDescription}>{service.acf.service_description}</Body1>
					</div>
				</div>
				<div className={styles.side}>
					<span className={clsx(styles.label, styles.faded, styles.noMargin)}>Что входит в услугу</span>
					<div className={styles.tags}>
						{service.acf.service_content.split('\n').map((item) =>
							<span className={styles.tag} key={item} title={item}>{item}</span>
						)}
					</div>
				</div>
			</div>
			<span className={styles.label}>Наши работы</span>
			{portfolio && category &&
				<div className={clsx(styles.block, styles.portfolio)}>
					<div className={clsx(styles.content, styles.cases)}>
						{portfolio.map((item) =>
							<Case
								key={item.id}
								categoryName="Все"
								categorySlug="all"
								pageId={1}
								work={item}
							/>)}
					</div>
					<div className={styles.side}>
						<Link className={clsx(styles.label, styles.faded, styles.noMargin)} href={`/portfolio/${category.slug}/1`}>Смотреть больше работ</Link>
					</div>
				</div>
			}
		</>
	)
}

export default ServicePage