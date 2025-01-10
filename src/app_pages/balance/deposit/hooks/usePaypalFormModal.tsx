import { ApiException } from '@api/base/base-service.dto'
import { balanceService } from '@api/balanceService'
import { BaseInputNumber } from '@components/data-input'
import yup from '@helper/yup-valiator'
import { yupResolver } from '@hookform/resolvers/yup'

import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { Button, Image, Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import clsx from 'clsx'
import { useUserContext } from '@providers/UserProvider'

export function usePaypalFormModal() {
	const { getPersonalInfo } = useUserContext()
	const [open, setOpen] = useState(false)
	const [order, setOrder] = useState<{
		amount: number
		id: string
	} | null>(null)
	const handleOpen = () => {
		setOpen(true)
	}
	const { t } = useTranslation('balance')
	const handleClose = () => {
		setOpen(false)
		setOrder(null)
	}
	const schema = yup.object().shape({
		amount: yup.number().required(t('message.invalid_number'))
	})
	const {
		control,
		setValue,
		handleSubmit,
		formState: { isSubmitting }
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			amount: 10
		}
	})

	const onSubmit = handleSubmit(async data => {
		try {
			const response = await balanceService.requestDepositPaypal(data)
			console.log('🚀 ~ usePaypalFormModal ~ response:', response)
			setOrder({
				amount: data.amount,
				id: response.data.data
			})
		} catch (e: unknown) {
			if (e instanceof ApiException) {
				toast.error(e.message)
			} else {
				toast.error('An unexpected error occurred')
			}
		}
	})

	const render = () => {
		return (
			<Modal isOpen={open} onClose={handleClose} size="xs">
				<ModalContent>
					<ModalHeader className="text-center">
						{t('title.enter_amount_you_want_to_deposit')}
					</ModalHeader>
					<ModalBody>
						<form className={clsx('flex flex-col gap-2')} onSubmit={onSubmit}>
							<div className="flex gap-1 items-center">
								<Button
									aria-label="button"
									size="sm"
									color="primary"
									onPress={() => setValue('amount', 200)}
								>
									200
								</Button>
								<Button
									aria-label="button"
									size="sm"
									color="secondary"
									onPress={() => setValue('amount', 500)}
								>
									500
								</Button>
								<Button
									aria-label="button"
									size="sm"
									color="success"
									onPress={() => setValue('amount', 1000)}
								>
									1000
								</Button>
								<Button
									aria-label="button"
									size="sm"
									color="danger"
									onPress={() => setValue('amount', 5000)}
								>
									5000
								</Button>
							</div>
							<BaseInputNumber
								control={control}
								name="amount"
								label={t('label.amount')}
								placeholder={t('label.amount')}
								isRequired
								min={0}
								endContent={
									<Image
										alt="usdc"
										src="https://s2.coinmarketcap.com/static/img/coins/200x200/3408.png"
										width={24}
									/>
								}
							/>
							{!order && (
								<Button
									aria-label="button"
									type="submit"
									color="primary"
									isLoading={isSubmitting}
								>
									{t('button.submit')}
								</Button>
							)}
						</form>
						<div
							className={clsx({
								hidden: !order
							})}
						>
							<PayPalScriptProvider
								options={{
									clientId: import.meta.env.VITE_PAYPAL_APP as string
								}}
							>
								{order?.id && (
									<PayPalButtons
										createOrder={async data => {
											console.log('🚀 ~ render ~ data:', data)
											return order?.id
										}}
										onApprove={async data => {
											await balanceService.captureDepositPaypal(data.orderID)
											handleClose()
											getPersonalInfo()
											console.log('🚀 ~ render ~ data:', data)
										}}
									/>
								)}
							</PayPalScriptProvider>
						</div>
					</ModalBody>
				</ModalContent>
			</Modal>
		)
	}
	return {
		handleOpenModalFormPaypal: handleOpen,
		handleCloseModalFormPaypal: handleClose,
		renderModalformPaypal: render
	}
}
