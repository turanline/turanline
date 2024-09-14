import { request } from '../functions/request'
import { CaseModel } from '../models/Case.model'
import { MediaModel } from '../models/Media.model'
import { PortfolioTagModel } from '../models/PortfolioTag.model'
import { ServiceModel } from '../models/Service.model'
import { WorkTypeModel } from '../models/WorkType.model'

const requestWordpress = async<T>(path: string): Promise<T> => {
	const response = await request<T>(`https://${process.env.WP_BASE}/${process.env.WP_API_PATH}/${path}`, [path], {
		'headers': {
			'Authorization': `Basic ${btoa(process.env.WP_TOKEN!)}`
		}
	})

	return response
}

const createParams = (object?: Record<string, string>): string => object ? new URLSearchParams(object).toString() : ''

export const wordpress = {
	getCases: async (params?: Record<string, string>) => requestWordpress<CaseModel[]>(`portfolio?acf_format=standard&${createParams(params)}`),
	getCasesHeaders: async (params?: Record<string, string>) => {
		const response = await fetch(`https://${process.env.WP_BASE}/${process.env.WP_API_PATH}/portfolio?${createParams(params)}`)

		return response.headers
	},
	getWorkTypes: async () => requestWordpress<WorkTypeModel[]>(`work_type`),
	getWorkTypeBySlug: async (slug: string) => requestWordpress<WorkTypeModel[]>(`work_type?slug=${slug}`),
	getWorkTypeById: async (id: number) => requestWordpress<WorkTypeModel>(`work_type/${id}`),
	getPortfolioTags: async () => requestWordpress<PortfolioTagModel[]>('portfolio_tags'),
	getPortfolioTagsByWorkType: async (workType: number) => {
		const tags = await requestWordpress<PortfolioTagModel[]>('portfolio_tags')
		const typeTags: PortfolioTagModel[] = []

		for (const tag of tags) {
			const portfolio = await wordpress.getCases({
				portfolio_tags: String(tag.id),
				...workType && { work_type: String(workType) }
			})

			if (portfolio.length > 0) typeTags.push(tag)
		}

		return typeTags
	},
	getMediaById: async (id: number) => requestWordpress<MediaModel>(`media/${id}`),
	getServices: async (params?: Record<string, string>) => requestWordpress<ServiceModel[]>(`services?${createParams(params)}&acf_format=standard`),
	getServiceBySlug: async (slug: string) => requestWordpress<ServiceModel[]>(`services?slug=${slug}&acf_format=standard`),
}