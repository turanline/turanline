export interface ServiceModel {
	id: number
	slug: string
	title: { rendered: string }
	featured_media?: number
	acf: {
		subtitle: string
		excerpt: string
		range_of_work: {
			image: string
			title: string
		}[]
		video: string
		tools_description: string
		tools: string[]
		service_content: string
		service_description: string
		portfolio_category?: number
	}
}