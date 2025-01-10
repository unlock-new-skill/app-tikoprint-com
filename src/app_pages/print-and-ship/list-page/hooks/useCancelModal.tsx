/* eslint-disable @typescript-eslint/no-explicit-any */
import { fulfillmentService, ListFulfillmentOrderItemDto } from '@api/fulfillmentService'
import { useBaseTableContext } from '@components/base-table'
import { Button, Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react'
import { useRequest } from 'ahooks'
import moment from 'moment'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function useCancelModal() {
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

	const { runAsync, loading } = useRequest(fulfillmentService.cancelOrder, {
		manual: true,
		onError: e => {
			toast.error(e?.message)
			handleClose()
		}
	})
	const render = () => (
		<CancelModal
			open={open}
			onClose={handleClose}
			order={order}
			runAsync={runAsync}
			loading={loading}
		/>
	)
	return {
		handleOpenCancelModal: handleOpen,
		renderCancelModal: render
	}
}

// eslint-disable-next-line react-refresh/only-export-components
function CancelModal({ open, onClose, order, runAsync, loading }: any) {
	const { t } = useTranslation('fulfillment')
	const { refresh } = useBaseTableContext()

	const onAction = async () => {
		await runAsync(order?.id as string)
		onClose()
		setTimeout(() => refresh(), 3000)
	}
	const canCancel =
		moment().diff(moment(order?.createdAt), 'minutes') < 5 || order?.status === 'PREPARE'
	// console.log('🚀 ~ canCancel:', canCancel)
	const navigate = useNavigate()
	return (
		<Modal isOpen={open} onClose={onClose}>
			<ModalContent>
				<ModalHeader className="text-primary-500 mx-auto">{order?.code}</ModalHeader>
				<ModalBody className="flex flex-col gap-1 items-center">
					{t('label.are_you_sure_to_cancel_this_order')}
					{!canCancel ? (
						<>
							<p className="text-center text-[0.7rem] text-danger-400">
								{t('label.create_ticket_to_request_cancel_order')}
							</p>
							<Link className="text-[0.7rem] text-primary-500 underline" to={'/term'}>
								{t('label.term')}
							</Link>
							<Button
								isLoading={loading}
								onPress={() => {
									onClose()
									navigate('/ticket/new', {
										state: {
											title: `Request cancel order ${order?.code}`,
											type: 'CANCEL_ORDER'
										}
									})
								}}
								color="danger"
							>
								{t('button.create_ticket')}
							</Button>
						</>
					) : (
						<>
							<p className="text-center text-[0.7rem] text-danger-400">
								{t('label.description_cancel')}
							</p>
							<Link className="text-[0.7rem] text-primary-500 underline" to={'/term'}>
								{t('label.term')}
							</Link>
							<Button isLoading={loading} onPress={onAction} color="danger">
								{t('button.confirm')}
							</Button>
						</>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}
