import { useState } from 'react'
// import { useCustomImageDrawer } from './useCustomImageDrawer'
import { Drawer, DrawerBody, DrawerContent, DrawerHeader } from '@nextui-org/react'
import { useTranslation } from 'react-i18next'
import ProductGrid from '../components/ProductGrid'
import { useCustomImageDrawer } from './useCustomImageDrawer'

export const useSelectProductDrawer = ({ handleAddProduct }) => {
	const [open, setOpen] = useState(false)

	const handleOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}
	const { t } = useTranslation('fulfillment')
	const { handleOpenCustomImageModal, renderCustomImageDrawer } = useCustomImageDrawer({
		handleCloseProductDrawer: handleClose,
		handleAddProduct,
		t
	})

	const render = () => {
		return (
			<>
				<Drawer size="full" isOpen={open} onClose={handleClose} placement="bottom">
					<DrawerContent>
						<DrawerHeader className="shadow-sm">
							<p className="text-center w-full">{t('title.select_product')}</p>
						</DrawerHeader>
						<DrawerBody>
							<ProductGrid handleOpenCustomImageModal={handleOpenCustomImageModal} />
						</DrawerBody>
					</DrawerContent>
				</Drawer>
				{renderCustomImageDrawer()}
			</>
		)
	}

	return {
		handleOpenSelectProductDrawer: handleOpen,
		renderProductDrawer: render
	}
}
