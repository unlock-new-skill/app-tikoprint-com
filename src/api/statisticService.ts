import BaseService, { CommonPagingProps } from '@api/base/BaseService'
// import { ApiDataRes } from './base/base-service.dto'

export interface ShopPostDto {
	id?: string
	thumnail_image: string
	cover_image?: string
	title: string
	description: string
	content: { title: string; content: string }[]
	subContent?: string
	view?: number
	slug?: string
	createdAt?: string
	updatedAt?: string
	seoTitle: string
	seoDescription: string
	seoKeywords: string
	active: boolean
}

export interface QueryListPostDto extends CommonPagingProps {
	name: string
	alias: string
}

class Statistic extends BaseService<ShopPostDto, QueryListPostDto> {
	getPODOrderStatistic = () => {
		const endpoint = '/api/seller/statistic/pod-order'
		return this.request.get(endpoint)
	}
}

export const statisticService = new Statistic()
