import BaseService, { CommonPagingProps } from '@api/base/BaseService'
import { ApiDataRes } from './base/base-service.dto'
// import { ApiDataRes } from './base/base-service.dto'

interface RequestDepositCoinbaseDto {
	amount: number
}

export interface TransactionDto {
	id: string
	type: string
	amount: number
	description: string
	createdAt: Date
	updatedAt: Date
	status: string
	change_log: ChangeLog
	logs: string[]
	sellerId: string
	sellerShopId?: string
	payment_gateway: string
	payment_gateway_order_id?: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	vendor_metadata: any
	adminId?: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Admin: any
	seller: Seller
	RapidFulfillmentOrderTransaction?: {
		rapidFulfillmentOrderId: string
	}
}

export interface ChangeLog {
	before: number
	after: number
	time: string
}

export interface Seller {
	email: string
	id: string
}

export interface QueryListTransactiontDto extends CommonPagingProps {
	type?: string
}

class Balance extends BaseService<TransactionDto, QueryListTransactiontDto> {
	BASE_ENDPOINT = '/api/seller/transaction'

	requestDepositCoinbase = (data: RequestDepositCoinbaseDto) => {
		return this.request.post<
			ApiDataRes<{
				chargeId: string
			}>
		>('/api/seller/balance/deposit/coinbase-gateway', data)
	}

	requestDepositPaypal = (data: RequestDepositCoinbaseDto) => {
		return this.request.post<ApiDataRes<string>>(
			'/api/seller/balance/deposit/paypal-gateway',
			data
		)
	}
	captureDepositPaypal = (orderId: string) => {
		return this.request.post<ApiDataRes<string>>(
			`/api/seller/balance/deposit/paypal-gateway/${orderId}`
		)
	}

	requestDepositBank = (data: RequestDepositCoinbaseDto) => {
		return this.request.post<
			ApiDataRes<{
				checkoutUrl: string
			}>
		>('/api/seller/balance/deposit/bank-gateway', data)
	}

	getPendingTrans = (gateway: string) => {
		return this.request.get<ApiDataRes<null | TransactionDto>>(
			`/api/seller/balance/deposit/pending-transaction`,
			{
				params: { gateway }
			}
		)
	}
}

export const balanceService = new Balance()
