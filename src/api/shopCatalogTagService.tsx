import BaseService, { CommonPagingProps } from '@api/base/BaseService'
import { ApiDataRes } from './base/base-service.dto'
// import { ApiDataRes } from './base/base-service.dto'

export interface ShopTagDto {
	id?: string
	label: string
	icon?: string
	color: string
	createdAt?: string
	updatedAt?: string
}

export interface SaveShopTagDto {
	tags: ShopTagDto[]
}

export interface QueryShopTagDto extends CommonPagingProps {
	name?: string
}

class ShopCatalogTag extends BaseService<ShopTagDto, QueryShopTagDto> {
	BASE_ENDPOINT = '/api/seller/shop/catalog/tag'

	saveTags = (data: SaveShopTagDto) => {
		return this.request.post<ApiDataRes<true>>(this.BASE_ENDPOINT, data)
	}
}

export const shopCatalogTagService = new ShopCatalogTag()
