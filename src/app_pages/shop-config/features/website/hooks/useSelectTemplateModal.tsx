import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react'
import { useState } from 'react'
import SelectTemplate from '../components/SelectTemplate'
// import { useShopConfigContext } from '@app_pages/shop-config/ShopConfigProvider'

export default function useSelectTemplateModal() {
	// const { setWebConfig } = useShopConfigContext()
	const [open, setOpen] = useState(false)
	console.log('🚀 ~ useSelectTemplateModal ~ open:', open)

	const handleOpen = () => {
		setOpen(true)
	}
	const handleClose = () => {
		setOpen(false)
	}
	const handleSelect = (id: string) => {
		console.log('🚀 ~ handleSelect ~ id:', id)
		// setWebConfig({ shopTemplateId: id, config: '{}' })
		handleClose()
	}
	console.log('🚀 ~ handleSelect ~ handleSelect:', handleSelect)

	const render = () => {
		return (
			<Modal
				onClose={handleClose}
				isOpen={open}
				size="5xl"
				title="Select Template"
			>
				<ModalContent>
					<ModalHeader>Select Template for your shop</ModalHeader>
					<ModalBody>
						<SelectTemplate onSelect={handleSelect} />
					</ModalBody>
				</ModalContent>
			</Modal>
		)
	}

	return {
		handleOpenSelectTemplateModal: handleOpen,
		renderSelectTemplateModal: render
	}
}
