import BaseService, { CommonPagingProps } from '@api/base/BaseService'
// import { ApiDataRes } from './base/base-service.dto'


export interface ShopDiscountDto {
    id?: string
    code: string
    type: "AMOUNT" | "PERCENT"
    value: number
    valid_from?: string
    valid_to?: string
    min_order_value: number
    max_usage: number
    used_count?: number
    createdAt?: string
    updatedAt?: string
    valid_range: {
        start?: Date
        end?: Date
    }
}

export interface QueryListDiscountDto extends CommonPagingProps {

    code: string
    valid_form?: string
    valid_to?: string
}


class ShopDiscountService extends BaseService<ShopDiscountDto, QueryListDiscountDto> {
    BASE_ENDPOINT = '/api/seller/shop/discount'
}

export const shopDiscountService = new ShopDiscountService()
