import { Container } from '@/shared/components/Container'
import { Title1 } from '@/shared/components/Title1'
import type { ReactNode } from 'react'
import styles from './layout.module.scss'

const ServicesLayout = ({ children }: { children: ReactNode }) => {

	return (
		<article className={styles.wrapper}>
			<Container>
				<Title1>Услуги</Title1>
				{children}
			</Container>
		</article>
	)
}

export default ServicesLayout