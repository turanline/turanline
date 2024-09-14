'use client'

import clsx from 'clsx'
import styles from './Button.module.scss'
import { manrope } from '@/global/fonst'
import { ButtonProps } from './Button.props'
import { useFormStatus } from 'react-dom'

export const Button = ({ className, appearance = 'primary', size = 'normal', ...props }: ButtonProps) => {
	const { button } = styles

	return (
		<span
			className={clsx(
				className,
				styles[appearance],
				styles[size],
				button,
				manrope.className)}
			{...props} />
	)
}

export const SubmitButton = ({ children, ...props }: ButtonProps) => {
	const { pending } = useFormStatus()

	return (
		<Button {...props}>
			{pending ? 'Отправка...' : children}
		</Button>
	)
}