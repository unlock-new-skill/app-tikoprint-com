import { useForm } from 'react-hook-form'
import { OrderProductItemDto } from '../components/Items'
import { yupResolver } from '@hookform/resolvers/yup'
import yup from '@helper/yup-valiator'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { fulfillmentService } from '@api/fulfillmentService'
import { useState } from 'react'
import { Button, Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react'
import { Link } from 'react-router-dom'
import { PiShootingStarBold } from 'react-icons/pi'

interface FormCreateOrderDto {
	print_only: boolean

	seller_order_id?: string

	shipping: {
		first_name: string
		last_name: string
		carrier?: string
		express_shipping?: boolean
		tracking_code?: string
		label_url?: string
		use_url?: boolean
		address_1?: string
		address_2?: string
		zip_code?: string
		city?: string
		state?: string
		country?: string
	}

	items: OrderProductItemDto[]
}

export default function useOrderForm() {
	const { t } = useTranslation('fulfillment')
	const { t: tcommon } = useTranslation('common')
	const [open, setOpen] = useState(false)

	const handleOpen = () => {
		setOpen(true)
	}
	const handleClose = () => {
		setOpen(false)
	}

	const schema = yup.object().shape({
		print_only: yup.boolean().required(),
		shipping: yup.object().shape({
			first_name: yup.string().required(t('message.required_field')),
			last_name: yup.string().required(t('message.required_field')),
			express_shipping: yup.boolean(),
			country: yup.string(),
			tracking_code: yup.string().when('print_only', {
				is: true, // Điều kiện là `print_only === true`
				then: schema => schema.required(t('message.required_field')),
				otherwise: schema => schema.notRequired()
			}),
			label_url: yup.string().when('print_only', {
				is: true,
				then: schema =>
					schema.required(t('message.required_field')).url(t('message.invalid_url')),
				otherwise: schema => schema.notRequired()
			}),
			use_url: yup.boolean().when('print_only', {
				is: true,
				then: schema => schema.required(t('message.required_field')),
				otherwise: schema => schema.notRequired()
			}),
			address_1: yup.string().when('print_only', {
				is: false, // Điều kiện là `print_only === false`
				then: schema => schema.required(t('message.required_field')),
				otherwise: schema => schema.notRequired()
			}),
			address_2: yup.string(), // Không bắt buộc
			zip_code: yup.string().when('print_only', {
				is: false,
				then: schema => schema.required(t('message.required_field')),
				otherwise: schema => schema.notRequired()
			}),
			city: yup.string().when('print_only', {
				is: false,
				then: schema => schema.required(t('message.required_field')),
				otherwise: schema => schema.notRequired()
			}),
			state: yup.string().when('print_only', {
				is: false,
				then: schema => schema.required(t('message.required_field')),
				otherwise: schema => schema.notRequired()
			})
		}),
		items: yup.array().required().min(1, t('message.min_1_item'))
	})

	const methodForm = useForm<FormCreateOrderDto>({
		defaultValues: {
			print_only: true,
			items: [],
			shipping: {
				first_name: '',
				last_name: '',
				carrier: '',
				express_shipping: false,
				tracking_code: '',
				label_url: '',
				use_url: false,
				address_1: '',
				address_2: '',
				zip_code: '',
				city: '',
				state: '',
				country: 'US'
			}
		},
		resolver: yupResolver(schema)
	})

	const onSubmit = methodForm.handleSubmit(async data => {
		try {
			// console.log('🚀 ~ useOrderForm ~ data:', data)
			const { items, ...restData } = data

			await fulfillmentService.createNewOrder({
				...restData,
				items: items.map(i => ({
					classification_id: i.classification_id,
					product_code: i.product_code,
					quantity: i.quantity,
					designs: i.designs
				}))
			})
			// console.log('🚀 ~ useOrderForm ~ result:', result)
			handleOpen()
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			toast.error(e?.message ?? tcommon('message.unxpected_error'))
		}
	})

	const render = () => {
		return (
			<Modal isOpen={open} onClose={handleClose} hideCloseButton>
				<ModalContent className="py-6">
					<ModalHeader className="flex justify-center gap-2">
						<p className=" text-success-500 font-normal">
							{t('title.create_order_success')}
						</p>
						<PiShootingStarBold className="text-yellow-500" />
					</ModalHeader>
					<ModalBody>
						<div className="grid grid-cols-2 gap-2">
							<Button
								color="primary"
								onPress={() => {
									methodForm.reset()
									handleClose()
								}}
							>
								{t('button.create_another')}
							</Button>
							<Link to={'/print-and-ship'} className="w-full">
								<Button fullWidth color="primary" variant="bordered">
									{t('button.go_to_order_page')}
								</Button>
							</Link>
						</div>
					</ModalBody>
				</ModalContent>
			</Modal>
		)
	}

	return {
		methodForm,
		onSubmit,
		handleOpenSuccessModal: handleOpen,
		renderSuccessModal: render
	}
}
