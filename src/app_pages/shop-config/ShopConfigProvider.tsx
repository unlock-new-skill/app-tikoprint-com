import { BasicShopConfigDto, shopConfigService } from '@api/shopConfigService'
import { ShopTemplateDto, shopTemplateService } from '@api/shopTemplateService'
import { createPageContext } from '@components/common/PageProvider'
// import { useLocalStorage } from '@hooks/useLocalStorage'
// import { useLayoutContext } from '@layout/Layout'
import { useRequest } from 'ahooks'
import { Dispatch, ReactNode, SetStateAction, useState } from 'react'

interface ShopConfigContextDto {
	loadingBasicConfigInfo: boolean
	basicInfo: BasicShopConfigDto | null
	needCreateShop: boolean
	setNeedCreateShop: Dispatch<SetStateAction<boolean>>
	triggerRefreshConfig: () => void
	template: ShopTemplateDto | null
	loadingTemplate: boolean
	webConfig?: {
		shopTemplateId: string
		config: string
	} | null
	setWebConfig?: Dispatch<
		SetStateAction<{
			shopTemplateId: string
			config: string
		} | null>
	>
	getTemplate: (id: string) => void
}
interface Props {
	children: ReactNode
}

const { usePageContext: useShopConfigContext, PageProvider } =
	createPageContext<ShopConfigContextDto>()

export { useShopConfigContext }

export default function ShopConfigProvider({ children }: Props) {
	// const {user} = useUserContext()
	// const { minimizeSidebar } = useLayoutContext()
	// useEffect(() => {
	// 	minimizeSidebar()
	// }, [])
	const [needCreateShop, setNeedCreateShop] = useState(true)

	const [refreshConfig, setRefreshConfig] = useState(false)

	// const [webConfig, setWebConfig] = useLocalStorage<{
	// 	shopTemplateId: string
	// 	config: string
	// } | null>('draft-shop-setup', null, 'any')

	const {
		data: template,
		loading: loadingTemplate,
		run: getTemplate
	} = useRequest(shopTemplateService.find, {
		manual: true
	})

	// useEffect(() => {
	// 	if (webConfig?.shopTemplateId) {
	// 		getTemplate(webConfig?.shopTemplateId)
	// 	}
	// }, [JSON.stringify(webConfig)])

	const { data: basicInfo, loading: loadingBasicConfigInfo } = useRequest(
		shopConfigService.getBasicInfomation,
		{
			onSuccess: data => {
				if (data.data.data?.id) {
					setNeedCreateShop(false)
					if (data.data.data.shopUITemplateId) {
						getTemplate(data.data.data.shopUITemplateId)
					}
				}
			},
			refreshDeps: [refreshConfig]
		}
	)

	const triggerRefreshConfig = () => {
		setRefreshConfig(p => !p)
	}

	const context: ShopConfigContextDto = {
		basicInfo: basicInfo ? basicInfo.data.data : null,
		loadingBasicConfigInfo,
		needCreateShop,
		setNeedCreateShop,
		triggerRefreshConfig,
		// setWebConfig,
		// webConfig,
		template: template ? template.data.data : null,
		loadingTemplate,
		getTemplate
	}

	return <PageProvider value={context}>{children} </PageProvider>
}
