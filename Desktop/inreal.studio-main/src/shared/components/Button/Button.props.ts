import type { HTMLAttributes } from 'react'

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
	appearance?: 'primary' | 'secondary' | 'transparent'
	size?: 'normal' | 'large'
}