import { ApiException } from '@api/base/base-service.dto'
import { QueryListFulfillmentOrderDto } from '@api/fulfillmentService'
import { BaseInput, BaseInputArray, BaseSelect } from '@components/data-input'
import yup from '@helper/yup-valiator'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@nextui-org/react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FaSearch } from 'react-icons/fa'
import { FaFilterCircleXmark } from 'react-icons/fa6'
import { toast } from 'react-toastify'

const schema = yup.object().shape({
	seller_order_id: yup.array(),
	status: yup.string()
})

interface Props {
	setQuery: React.Dispatch<React.SetStateAction<QueryListFulfillmentOrderDto>>
}

export default function FilterListFulfillmentOrder({ setQuery }: Props) {
	const {
		control,
		handleSubmit,
		watch,
		reset
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} = useForm<any>({
		mode: 'onTouched',
		resolver: yupResolver(schema),
		defaultValues: {
			seller_order_id: [],
			orderCode: [],
			status: '',
			sort: 'createdAt',
			dir: 'desc',
			print_only: undefined
		}
	})
	console.log(watch())

	const onSubmit = handleSubmit(async data => {
		try {
			setQuery(p => ({ ...p, ...data }))
		} catch (e: unknown) {
			if (e instanceof ApiException) {
				toast.error(e.message)
			} else {
				toast.error('An unexpected error occurred')
			}
		}
	})
	const { t } = useTranslation('fulfillment')

	return (
		<form onSubmit={onSubmit} className="flex gap-2  items-center my-2">
			<BaseInputArray
				labelPlacement="outside"
				label={t('label.seller_order_id')}
				// placeholder="Enter name"
				control={control}
				name="seller_order_id"
				placeholder={t('placeholder.seller_order_id')}
				className="min-w-[260px] max-w-1/2"
				isRequired={false}
			/>
			<BaseInputArray
				labelPlacement="outside"
				label={t('label.order_code')}
				// placeholder="Enter name"
				control={control}
				name="orderCode"
				placeholder={t('placeholder.order_code')}
				className="min-w-[260px] max-w-1/2"
				isRequired={false}
			/>
			<BaseInput
				labelPlacement="outside"
				label={t('label.seller_order_id')}
				// placeholder="Enter name"
				control={control}
				name="seller_order_id"
				className="min-w-[240px]"
				isRequired={false}
			/>
			<BaseSelect
				labelPlacement="outside"
				label={t('label.print_service')}
				// placeholder="Enter name"
				control={control}
				name="print_only"
				options={[
					{
						label: t('label.print_only'),
						value: true
					},
					{
						label: t('label.print_and_ship'),
						value: false
					}
				]}
				className="min-w-[170px]"
				isRequired={false}
			/>
			<BaseSelect
				labelPlacement="outside"
				label={t('label.status')}
				// placeholder="Enter name"
				control={control}
				name="status"
				options={[
					{
						value: 'EDITABLE',
						label: 'Just created'
					},
					{
						value: 'WAIT_FOR_PAY',
						label: 'Not paid'
					},
					{
						value: 'IN_PRODUCTION',
						label: 'In production'
					},
					{
						value: 'FULFILL',
						label: 'Fulfill'
					},
					{
						value: 'IN_TRANSIT',
						label: 'In transit'
					},
					{
						value: 'DELIVERED',
						label: 'Delivered'
					},

					{
						value: 'CANCELED',
						label: 'Canceled'
					}
				]}
				className="min-w-[160px]"
				isRequired={false}
			/>
			<BaseSelect
				labelPlacement="outside"
				label={t('label.sort_by')}
				// placeholder="Enter name"
				control={control}
				name="sort"
				options={[
					{
						label: t('label.created_at'),
						value: 'createdAt'
					},
					{
						label: t('label.updated_at'),
						value: 'updatedAt'
					}
				]}
				className="min-w-[160px]"
				isRequired={false}
			/>
			<BaseSelect
				labelPlacement="outside"
				label={t('label.sort_dir')}
				// placeholder="Enter name"
				control={control}
				name="dir"
				options={[
					{
						label: t('label.asc'),
						value: 'asc'
					},
					{
						label: t('label.desc'),
						value: 'desc'
					}
				]}
				className="min-w-[140px]"
				isRequired={false}
			/>

			<Button
				aria-label="button"
				className="self-end"
				size="sm"
				color="default"
				variant="bordered"
				onPress={() =>
					reset({
						seller_order_id: [],
						orderCode: [],
						status: '',
						sort: 'createdAt',
						dir: 'desc',
						print_only: undefined
					})
				}
				isIconOnly
			>
				<FaFilterCircleXmark />
			</Button>
			<Button
				aria-label="button"
				className="self-end"
				size="sm"
				type="submit"
				color="primary"
				// variant="bordered"
				isIconOnly
			>
				<FaSearch />
			</Button>
		</form>
	)
}
