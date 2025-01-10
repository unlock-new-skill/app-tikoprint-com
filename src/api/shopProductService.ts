import BaseService, { CommonPagingProps } from '@api/base/BaseService'
import { ApiDataRes } from './base/base-service.dto'

export interface SaveShopProductDto {
    id?: string
    name: string
    description: string
    video?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    images: any[]
    tags?: string[]
    collectionId: string
    isActive: boolean

}

export interface SaveAttributeAndVariationDto {
    attributes: {
        id?: string
        name: string
        value: string[]
    }[]
    variations: {
        id?: string
        sku?: string
        price: number
        stock: number
        attributes: { [key: string]: string }
    }[]
}

export interface QueryListProductDto extends CommonPagingProps {
    name: string
    alias: string
}

export interface ShopProductDto {
    id: string
    name: string
    video?: string
    size_chart?: string
    description: string
    images: string[]
    collectionId: string
    isActive?: boolean
    tags: Tag[] | string[]
    view: number
}

export interface Tag {
    id: string;
    shopProductId: string;
    shopTagId: string;

}

export interface GetShopProductVariationDto {
    attributes: {
        id: string,
        name: string
        values: string[]
    }[]
    variations: {
        id: string
        attributes: { [key: string]: string }
        price: number,
        stock: number,
        sku?: string
    }[]
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
class ShopProduct extends BaseService<ShopProductDto, QueryListProductDto> {
    BASE_ENDPOINT = '/api/seller/shop/product'

    // selectTemplate = (id: string) => {
    //     return this.request.patch(<ApiDataRes<true>)('/api/seller/shop')

    // } 
    saveVariation = (data: SaveAttributeAndVariationDto, productId: string) => {
        return this.request.post<ApiDataRes<true>>(`${this.BASE_ENDPOINT}/${productId}/variations`, data)
    }


    getVariation = (productId: string) => {
        return this.request.get<ApiDataRes<GetShopProductVariationDto>>(`${this.BASE_ENDPOINT}/${productId}/variations`)
    }

    changeActiveStatus = (data: { isActive: boolean }, id: string) => {
        return this.request.patch(`${this.BASE_ENDPOINT}/${id}/active`, data)
    }
}

export const shopProductService = new ShopProduct()
