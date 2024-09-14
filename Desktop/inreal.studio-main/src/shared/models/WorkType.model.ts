export interface WorkTypeModel {
	id: number
	description: string
	name: string
	slug: string
	acf: {
		good_for: string
	}
}