import type { HTMLAttributes } from 'react'

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
	active: string
	basePath: string
	tabs: {
		displayName: string
		slug: string
	}[]
}