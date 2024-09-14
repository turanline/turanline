export interface CaseModel {
	id: number
	title: { rendered: string }
	content: { rendered: string }
	featured_media?: string
	work_type: number[]
	slug: string
	acf: {
		year?: string
		preview?: string
	}
}