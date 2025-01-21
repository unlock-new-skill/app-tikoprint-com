import { ApiException } from '@api/base/base-service.dto'
import { balanceService } from '@api/balanceService'
import { BaseInputNumber } from '@components/data-input'
import yup from '@helper/yup-valiator'
import { yupResolver } from '@hookform/resolvers/yup'
import { Checkout, CheckoutButton, CheckoutStatus } from '@coinbase/onchainkit/checkout'
import { base } from 'viem/chains'
import { OnchainKitProvider } from '@coinbase/onchainkit'

import { Button, Image, Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import clsx from 'clsx'
import { useRequest } from 'ahooks'

export function useCoinbaseFormModal() {
	const [open, setOpen] = useState(false)
	const [chargeId, setChargeId] = useState<{
		amount: number
		chargeId: string
	} | null>(null)
	const handleOpen = () => {
		setOpen(true)
	}
	const { t } = useTranslation('balance')
	const handleClose = () => {
		setOpen(false)
		setChargeId(null)
	}
	const schema = yup.object().shape({
		amount: yup.number().required(t('message.invalid_number')).min(5)
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
			const response = await balanceService.requestDepositCoinbase(data)
			setChargeId({
				amount: data.amount,
				chargeId: response.data.data.chargeId
			})
		} catch (e: unknown) {
			if (e instanceof ApiException) {
				toast.error(e.message)
			} else {
				toast.error('An unexpected error occurred')
			}
		}
	})

	useRequest(balanceService.getPendingTrans, {
		defaultParams: ['COINBASE'],
		onSuccess: data => {
			if (data?.data?.data) {
				console.log('🚀 ~ useCoinbaseFormModal ~ data?.data?.data:', data?.data?.data)
				// setOrder({
				// 	id: data.data.data?.payment_gateway_order_id as string,
				// 	amount: data.data.data.amount
				// })
			}
		}
	})
	//  COINBASE
	// 	PAYPAL

	const render = () => {
		return (
			<Modal isOpen={open} onClose={handleClose} size="xs">
				<ModalContent>
					<ModalHeader className="text-center">
						{t('title.enter_amount_you_want_to_deposit')}
					</ModalHeader>
					<ModalBody>
						<form className={clsx('flex flex-col gap-2')} onSubmit={onSubmit}>
							{!chargeId ? (
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
							) : (
								<p>{t('label.click_button_to_process')}</p>
							)}
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
							{!chargeId && (
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

						<OnchainKitProvider
							apiKey={import.meta.env.VITE_COINBASE_KIT_PUBLIC_KEY}
							chain={base}
						>
							{chargeId?.chargeId && (
								<>
									<Checkout chargeHandler={async () => chargeId?.chargeId}>
										<CheckoutButton
											// coinbaseBranded
											text={`${t('button.pay')}: ${chargeId?.amount ?? ''} $`}
											className={clsx('bg-primary-500 text-white', {
												hidden: !chargeId?.amount
											})}
										/>
										<CheckoutStatus />
									</Checkout>
								</>
							)}
						</OnchainKitProvider>
					</ModalBody>
				</ModalContent>
			</Modal>
		)
	}
	return {
		handleOpenModalForm: handleOpen,
		handleCloseModalForm: handleClose,
		renderModalform: render
	}
}
