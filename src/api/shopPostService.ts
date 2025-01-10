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

class ShopPostService extends BaseService<ShopPostDto, QueryListPostDto> {
	BASE_ENDPOINT = '/api/seller/shop/post'

	changeActiveStatus = (data: { active: boolean }, id: string) => {
		return this.request.patch(`${this.BASE_ENDPOINT}/${id}/active`, data)
	}
}

export const shopPostService = new ShopPostService()
