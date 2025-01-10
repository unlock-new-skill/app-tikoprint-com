import BaseService, { CommonPagingProps, PagingDataDto } from '@api/base/BaseService'
import { ApiDataRes } from './base/base-service.dto'
import { OrderProductItemDto } from '@app_pages/print-and-ship/detail-page/components/Items'
// import { ApiDataRes } from './base/base-service.dto'
// print_only: boolean

// 	seller_order_id?: string

// 	shipping: {
// 		first_name: string
// 		last_name: string
// 		express_shipping: boolean
// 		tracking_code?: string
// 		label_url?: string
// 		use_url?: boolean
// 		address_1?: string
// 		address_2?: string
// 		zip_code?: string
// 		city?: string
// 		state?: string
// 	}

// 	items: {
// 		product_code: string
// 		classification_id: string
// 		quantity: number
// 		designs: {
// 			side: 'Front' | 'Back' | 'Right' | 'Left' | 'Mockup'
// 			design_url: string[]
// 		}[]
// 	}[]
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

export interface AvaiableProductDto {
	id: string
	name: string
	subTitle: string
	SKU: string
	avatar: string
	code: string
	shippingHandlingFee: number
	ProductShippingRate: ProductShippingRate[]
	modelImages: AvaiableProductModelImage[]
	productClassifications: ProductClassification[]
	productAttributes: ProductAttribute[]
	ProductAttributeOptionConfig: ProductAttributeOptionConfig[]
}

export interface ProductAttributeOptionConfig {
	attributeOptionId: string
	display_status: boolean
	sortIndex: number
}

export interface ProductShippingRate {
	id: string
	additionalItemFee: number
	country: string
	firstItemFee: number
	sortOrderFee: number
	stateOrRegion: string
	zipOrPostalCode: string
}

export interface AvaiableProductModelImage {
	additional_printing_price: number
	config: AvaiableProductModelConfig[]
	image?: string
	name: string
	id: string
}

export interface AvaiableProductModelConfig {
	width: number
	height: number
	top: number
	left: number
	design_url?: string
	compress_design_url?: string
}

export interface ProductAttribute {
	attributeId: string
	id: string
	productId: string
	attribute: AvaiableProductAttribute
}

export interface AvaiableProductAttribute {
	id: string
	name: string
	attributeOptions: AttributeAttributeOption[]
}

export interface AttributeAttributeOption {
	id: string
	value: string
	attributeId: string
	customValue: CustomValue | null
}

export interface CustomValue {
	color_code?: string
}

export interface ProductClassification {
	rawAttributeOptions: string
	id: string
	productId: string
	price: number
	attributeOptions: ProductClassificationAttributeOption[]
}

export interface ProductClassificationAttributeOption {
	id: string
	productClassificationId: string
	attributeOptionId: string
	deleted: boolean
	createdAt: Date
	updatedAt: Date
}

//ORDER DTO
export interface OrderShippingDto {
	country?: string
	state?: string
	city?: string
	address_1?: string
	address_2?: string
	zip_code?: string
	first_name?: string
	last_name?: string
	tracking_code?: string
	carrier?: string
	express_shipping?: boolean
}

export interface CreateFulfillmentOrderDto {
	print_only: boolean

	seller_order_id?: string
	shipping: {
		first_name: string
		last_name: string
		carrier?: string
		express_shipping?: boolean
		tracking_code?: string
		label_url?: string
		use_url?: boolean
		address_1?: string
		address_2?: string
		zip_code?: string
		city?: string
		state?: string
	}
	items: {
		product_code: string
		classification_id: string
		quantity: number
		designs: {
			side: string
			design_url: ({
				design_url: string
				compress_design_url: string
			} | null)[]
		}[]
	}[]
}

export interface OrderTransactionDto {
	id: string
	type: string
	Transaction: {
		id: string
		status: 'PENDING' | 'FAILED' | 'SUCCESS'
	}
}

export interface ListFulfillmentOrderItemDto {
	id: string
	total: number
	status: string
	cancel_reason?: string
	code?: string
	orderCode: string
	createdAt: string
	print_only: boolean
	seller_order_id?: string
	updatedAt: string
	production_completed: boolean
	payment_transaction?: OrderTransactionDto
	refund_transaction?: OrderTransactionDto
	Shipping?: {
		tracking_code?: string
		label_url?: string
		carrier?: 'USPS'
		first_name?: string
		last_name?: string
		address_1?: string
		address_2?: string
		city?: string
		zip_code?: string
		country?: string
		state?: string
		express_shipping?: boolean
	}
	Items?: OrderProductItemDto[]
}

export interface QueryListFulfillmentOrderDto extends CommonPagingProps {
	seller_order_id?: string
	status?: string
}
class FulfillmentService extends BaseService<
	ListFulfillmentOrderItemDto,
	QueryListFulfillmentOrderDto
> {
	BASE_ENDPOINT = '/api/seller/fulfillment/order'

	getAvaiableProduct = () => {
		return this.request.get<ApiDataRes<PagingDataDto<AvaiableProductDto>>>(
			`/api/seller/fulfillment/avaiable-product`
		)
	}

	createNewOrder = (data: CreateFulfillmentOrderDto) => {
		return this.request.post<ApiDataRes<boolean>>(this.BASE_ENDPOINT, data)
	}

	paymentOrder = (id: string) => {
		return this.request.post<ApiDataRes<boolean>>(`${this.BASE_ENDPOINT}/${id}/payment`)
	}

	cancelOrder = (id: string) => {
		return this.request.post<ApiDataRes<boolean>>(`${this.BASE_ENDPOINT}/${id}/cancel`)
	}
}

export const fulfillmentService = new FulfillmentService()
