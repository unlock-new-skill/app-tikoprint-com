import BaseService, { CommonPagingProps } from '@api/base/BaseService'
import { ApiDataRes } from './base/base-service.dto'
// import { ApiDataRes } from './base/base-service.dto'

export interface ShopCollectionDto {
	id?: string
	label: string
	thumnail: string
	isWebMenu: boolean
	isTrending: boolean
	createdAt?: string
	updatedAt?: string
}

export interface SaveShopCollectionDto {
	collections: ShopCollectionDto[]
}

export interface QueryShopCollectionDto extends CommonPagingProps {
	name?: string
}

class ShopCatalogCollection extends BaseService<
	ShopCollectionDto,
	QueryShopCollectionDto
> {
	BASE_ENDPOINT = '/api/seller/shop/catalog/collection'

	saveCollections = (data: SaveShopCollectionDto) => {
		return this.request.post<ApiDataRes<true>>(this.BASE_ENDPOINT, data)
	}
}

export const shopCatalogCollectionService = new ShopCatalogCollection()
