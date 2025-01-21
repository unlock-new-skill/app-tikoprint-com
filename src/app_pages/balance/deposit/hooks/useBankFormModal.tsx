import { balanceService } from '@api/balanceService'
import { BaseInputNumber } from '@components/data-input'
import yup from '@helper/yup-valiator'
import { yupResolver } from '@hookform/resolvers/yup'
// import { usePayOS, PayOSConfig } from 'payos-checkout'
// import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { Button, Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import clsx from 'clsx'
import { useRequest } from 'ahooks'
// import { useLocation } from 'react-router-dom'
// import { useUserContext } from '@providers/UserProvider'
// import { useRequest } from 'ahooks'

export function useBankFormModal() {
	// const { getPersonalInfo } = useUserContext()
	const [open, setOpen] = useState(false)
	const [order, setOrder] = useState<{
		checkoutUrl: string
		transactionId: string
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
		amount: yup.number().required(t('message.invalid_number')).min(100000)
	})
	const {
		control,
		setValue,
		watch,
		handleSubmit,
		formState: { isSubmitting }
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			amount: 1000000
		}
	})

	const onSubmit = handleSubmit(async data => {
		try {
			const response = await balanceService.requestDepositBank(data)
			console.log('🚀 ~ usePaypalFormModal ~ response:', response)
			setOrder({
				checkoutUrl: response.data.data.checkoutUrl,
				transactionId: response.data.data.transactionId
			})
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			toast.error(e?.message)
		}
	})

	useRequest(balanceService.getPendingTrans, {
		defaultParams: ['BANK'],
		onSuccess: data => {
			console.log('🚀 ~ useBankFormModal ~ data:', data)
			if (data?.data?.data) {
				setOrder({
					transactionId: data.data.data.id,
					checkoutUrl: ('https://pay.payos.vn/web/' +
						data.data.data.payment_gateway_order_id) as string
				})
			}
		}
	})

	const { run: runCancelOrder, loading: loadingCancel } = useRequest(
		balanceService.cancelDepositTransaction,
		{
			manual: true,
			onSuccess: () => {
				setOrder(null)
			},
			onError: e => {
				toast.error(e?.message)
			}
		}
	)

	//  COINBASE
	// 	PAYPAL

	const amount = watch('amount')
	const preview = amount > 0 ? `${(amount / 25800).toFixed(2)}$ ( 1$ = 25800vnd)` : ''

	console.log('🚀 ~ useBankFormModal ~ preview:', preview)

	// // const { pathname } = useLocation()
	// const payOSConfig: PayOSConfig = {
	// 	RETURN_URL: window.location.href,
	// 	ELEMENT_ID: 'qrcode-element', // required
	// 	CHECKOUT_URL: order?.checkoutUrl as string, // required
	// 	embedded: true, // Nếu dùng giao diện nhúng
	// 	onSuccess: () => {
	// 		toast.success('message.please_wait_a_second')
	// 		//TODO: Hành động sau khi người dùng thanh toán đơn hàng thành công
	// 	},
	// 	onCancel: (event: any) => {
	// 		console.log('🚀 ~ useBankFormModal ~ event:', event)
	// 		//TODO: Hành động sau khi người dùng Hủy đơn hàng
	// 	},
	// 	onExit: (event: any) => {
	// 		console.log('🚀 ~ useBankFormModal ~ event:', event)
	// 		//TODO: Hành động sau khi người dùng tắt Pop up
	// 	}
	// }
	// console.log('🚀 ~ useBankFormModal ~ payOSConfig:', payOSConfig)
	// const { open: openPopupQR, exit } = usePayOS(payOSConfig)

	const render = () => {
		return (
			<Modal isOpen={open} onClose={handleClose} size="xs">
				<ModalContent>
					<ModalHeader className="text-center">
						{t('title.enter_amount_you_want_to_deposit')}
					</ModalHeader>
					<ModalBody>
						{!order?.checkoutUrl ? (
							<>
								<form className={clsx('flex flex-col gap-2')} onSubmit={onSubmit}>
									{!order ? (
										<div className="flex gap-1 items-center">
											<Button
												aria-label="button"
												size="sm"
												color="primary"
												onPress={() => setValue('amount', 500000)}
											>
												500.000
											</Button>
											<Button
												aria-label="button"
												size="sm"
												color="secondary"
												onPress={() => setValue('amount', 1000000)}
											>
												1.000.000
											</Button>
											<Button
												aria-label="button"
												size="sm"
												color="success"
												onPress={() => setValue('amount', 5000000)}
											>
												5.000.000
											</Button>
											<Button
												aria-label="button"
												size="sm"
												color="danger"
												onPress={() => setValue('amount', 10000000)}
											>
												10.000.000
											</Button>
										</div>
									) : (
										<p>{t('label.click_button_to_process')}</p>
									)}

									<BaseInputNumber
										control={control}
										name="amount"
										label={t('label.amount')}
										placeholder={t('label.amount')}
										isRequired
										isDisabled={Boolean(order?.checkoutUrl)}
										min={0}
										endContent={<span>$</span>}
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
								<p className="text-center ">{preview}</p>
							</>
						) : (
							<>
								<Button
									variant="flat"
									color="danger"
									onPress={() => runCancelOrder(order.transactionId)}
									isLoading={loadingCancel}
								>
									{t('button.cancel_order')}
								</Button>
								<Button
									color="primary"
									onPress={() => window.open(order.checkoutUrl, '_blank')}
									variant="flat"
								>
									{t('button.go_to_checkout_page')}
								</Button>
								<p className="text-center ">{t('label.bank_checkout_note')}</p>
							</>
						)}
					</ModalBody>
				</ModalContent>
			</Modal>
		)
	}
	return {
		handleOpenModalFormBank: handleOpen,
		handleCloseModalFormBank: handleClose,
		renderModalformBank: render
	}
}
