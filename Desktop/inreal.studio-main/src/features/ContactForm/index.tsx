'use client'

import { Card } from '@/shared/components/Card'
import styles from './ContactForm.module.scss'
import { Title3 } from '@/shared/components/Title3'
import { Input } from '@/shared/components/Input'
import { Button, SubmitButton } from '@/shared/components/Button'

import { createRequest } from './createRequest.action'
import { usePathname } from 'next/navigation'
import { useFormState } from 'react-dom'
import Link from 'next/link'

export const ContactForm = () => {
	const pathname = usePathname()
	const [state, handle] = useFormState(createRequest, {
		message: '',
		suggestion: ''
	})

	return (
		<Card className={styles.card}>
			{!state.message ? <>
				<Title3 className={styles.cardTitle}>
					рассчитаем полную <br /> стоимость вашего проекта
				</Title3>
				<form action={handle} className={styles.form}>
					<input type="text" readOnly style={{ display: 'none' }} name="pathname" value={pathname} />
					<Input placeholder="Ваше имя" name="name" />
					<Input mask="+7 (000) 000-00-00" placeholder="+7 (" type="tel" name="tel" />
					<button type="submit">
						<SubmitButton appearance="primary" size="large">Оставить заявку</SubmitButton>
					</button>
				</form>
			</>
				: <>
					<Title3 className={styles.cardTitle}>{state?.message}</Title3>
					<Link href={pathname} className={styles.closeButton}><Button size="large">Закрыть</Button></Link>
				</>}
			<span className={styles.suggestion}>
				{state?.suggestion}
			</span>
		</Card>
	)
}