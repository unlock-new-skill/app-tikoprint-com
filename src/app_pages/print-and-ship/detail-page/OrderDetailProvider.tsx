import { AvaiableProductDto, fulfillmentService } from '@api/fulfillmentService'
import { createPageContext } from '@components/common/PageProvider'
import { useRequest } from 'ahooks'
import { ReactNode } from 'react'

export interface OrderDetailProviderDto {
	loadingProduct: boolean
	products: AvaiableProductDto[]
}

const { PageProvider, usePageContext: useOrderDetailContext } =
	createPageContext<OrderDetailProviderDto>()

export default function OrderDetailProvider({ children }: { children: ReactNode }) {
	const { data: productData, loading: loadingProduct } = useRequest(
		fulfillmentService.getAvaiableProduct
	)

	const value = {
		loadingProduct,
		products: productData?.data?.data?.dataTable ?? []
	}
	return <PageProvider value={value}>{children}</PageProvider>
}
export { useOrderDetailContext }
