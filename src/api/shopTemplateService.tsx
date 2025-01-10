import BaseService, { CommonPagingProps } from '@api/base/BaseService'
// import { ApiDataRes } from './base/base-service.dto'

export interface ShopTemplateDto {
	id: string
	name: string
	alias: string
	preview_image: string
	price: number
	active: boolean
	createdAt: string
	updatedAt: string
	preview_url: string
	default_theme_config: string
	theme_config_rules: string
}

export interface QueryListShopTemplateDto extends CommonPagingProps {
	name?: string
	isActive?: boolean
}

class ShopTemplate extends BaseService<
	ShopTemplateDto,
	QueryListShopTemplateDto
> {
	BASE_ENDPOINT = '/api/seller/shop-template'
}

export const shopTemplateService = new ShopTemplate()
