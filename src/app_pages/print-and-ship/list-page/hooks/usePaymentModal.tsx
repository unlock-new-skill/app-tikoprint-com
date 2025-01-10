/* eslint-disable @typescript-eslint/no-explicit-any */
import { fulfillmentService, ListFulfillmentOrderItemDto } from '@api/fulfillmentService'
import { useBaseTableContext } from '@components/base-table'
import { Button, Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react'
import { useRequest } from 'ahooks'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

export default function usePaymentModal() {
	const [open, setOpen] = useState(false)
	const [order, setOrder] = useState<null | ListFulfillmentOrderItemDto>(null)
	const handleClose = () => {
		setOpen(false)
		setOrder(null)
	}
	const handleOpen = (row: ListFulfillmentOrderItemDto) => {
		setOpen(true)
		setOrder(row)
	}
	const { t } = useTranslation('fulfillment')

	const { runAsync, loading } = useRequest(fulfillmentService.paymentOrder, {
		manual: true,
		onSuccess: () => {
			toast.success(t('message.payment_success'))
		},
		onError: (e: any) => {
			toast.error(e?.message)
		}
	})
	const render = () => (
		<PaymentModal
			open={open}
			onClose={handleClose}
			order={order}
			runAsync={runAsync}
			loading={loading}
		/>
	)
	return {
		handleOpenPaymentModal: handleOpen,
		renderPaymentModal: render
	}
}

// eslint-disable-next-line react-refresh/only-export-components
function PaymentModal({ open, onClose, order, runAsync, loading }: any) {
	const { t } = useTranslation('fulfillment')
	const { refresh } = useBaseTableContext()

	const handlePayment = async () => {
		const res = await runAsync(order?.id as string)
		if (res.data.data) {
			onClose()
			setTimeout(() => refresh(), 3000) // Gọi refresh sau 3 giây
		}
	}

	return (
		<Modal isOpen={open} onClose={onClose}>
			<ModalContent>
				<ModalHeader className="text-primary-500 mx-auto">{order?.code}</ModalHeader>
				<ModalBody className="flex flex-col gap-4 items-center">
					{t('label.pay_amount_for_this_order', { amount: order?.total + '$' })}
					<Button isLoading={loading} onPress={handlePayment} color="primary">
						{t('button.confirm')}
					</Button>
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}
