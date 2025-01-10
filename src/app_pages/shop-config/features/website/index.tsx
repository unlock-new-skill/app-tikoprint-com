import { useShopConfigContext } from '@app_pages/shop-config/ShopConfigProvider'
import useSelectTemplateModal from './hooks/useSelectTemplateModal'
import { TypeAnimation } from 'react-type-animation'
import { Button } from '@nextui-org/react'
import WebFrame from './components/WebFrame'

export default function WebSiteSetup() {
	const { webConfig } = useShopConfigContext()
	console.log('🚀 ~ WebSiteSetup ~ webConfig:', webConfig)
	const isSelectedTemplate = Boolean(webConfig?.shopTemplateId)
	const { renderSelectTemplateModal, handleOpenSelectTemplateModal } =
		useSelectTemplateModal()

	return (
		<div className="flex-1">
			{!isSelectedTemplate ? (
				<div className="h-[90vh] border flex-1 flex justify-center items-center">
					<div className="flex flex-col items-center">
						<TypeAnimation
							sequence={[
								`Start build your shop now`,
								1000,
								'Select a template & make it for your self',
								1000,
								'Free to start right now'
							]}
							wrapper="p"
							speed={30}
							className="font-bold"
							style={{
								fontSize: '2em',
								display: 'inline-block'
							}}
							repeat={Infinity}
						/>
						<Button
							aria-label="button"
							className="w-max"
							color="primary"
							onPress={handleOpenSelectTemplateModal}
						>
							Choose Template
						</Button>
					</div>
				</div>
			) : (
				<div className=" flex">
					<WebFrame />
				</div>
			)}
			{renderSelectTemplateModal()}
		</div>
	)
}
