import { CircularProgress } from '@nextui-org/react'
import BasicShopInfoForm from './features/basic-info-form'
import ShopConfigProvider, { useShopConfigContext } from './ShopConfigProvider'
// import WebSiteSetup from './features/website'

export default function ShopConfig() {
	return (
		<ShopConfigProvider>
			<div className="flex flex-col gap-2">
				<h3 className="font-normal">Shop Infomation & Config</h3>
				<PageTabs />
			</div>
		</ShopConfigProvider>
	)
}

function PageTabs() {
	const {
		basicInfo,
		loadingBasicConfigInfo,
		// needCreateShop,
		setNeedCreateShop
	} = useShopConfigContext()
	return (
		// <Tabs color="primary">
		// 	<Tab key="basic" title="Basic Infomation">
		<div>
			{loadingBasicConfigInfo ? (
				<div className="h-[60vh] flex items-center justify-center">
					<CircularProgress />
				</div>
			) : (
				<BasicShopInfoForm
					initData={basicInfo}
					setNeedCreateShop={setNeedCreateShop}
				/>
			)}
		</div>
		// 	</Tab>
		// 	<Tab
		// 		key="website"
		// 		title="Website"
		// 		isDisabled={needCreateShop || loadingBasicConfigInfo}
		// 	>
		// 		{loadingBasicConfigInfo ? (
		// 			<div className="h-[60vh] flex items-center justify-center">
		// 				<CircularProgress />
		// 			</div>
		// 		) : (
		// 			<WebSiteSetup />
		// 		)}
		// 	</Tab>
		// 	<Tab
		// 		key="payment"
		// 		title="Payment"
		// 		isDisabled={needCreateShop || loadingBasicConfigInfo}
		// 	>
		// 		Payment
		// 	</Tab>
		// </Tabs>
	)
}
