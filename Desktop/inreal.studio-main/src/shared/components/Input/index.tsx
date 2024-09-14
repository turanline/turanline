import styles from './Input.module.scss'
import clsx from 'clsx'
import { IMaskMixin } from 'react-imask'

export const Input = IMaskMixin(({ inputRef, className, ...props }) => {
	return (
		// @ts-expect-error its seems like imask's bug
		<input {...props} className={clsx(styles.input, className)} ref={inputRef} />
	)
})
