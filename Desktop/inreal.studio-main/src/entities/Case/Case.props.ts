import type { CaseModel } from '@/shared/models/Case.model'

export interface CaseProps {
	className?: string
	pageId: number
	categorySlug: string
	categoryName: string

	work: CaseModel
	searchParams?: { [key: string]: string }
}