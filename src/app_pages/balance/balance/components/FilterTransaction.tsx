import { ApiException } from '@api/base/base-service.dto'
import { ListFulfillmentOrderItemDto, QueryListFulfillmentOrderDto } from '@api/fulfillmentService'
import { BaseInput } from '@components/data-input'
import yup from '@helper/yup-valiator'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@nextui-org/react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FaSearch } from 'react-icons/fa'
import { FaFilterCircleXmark } from 'react-icons/fa6'
import { toast } from 'react-toastify'

const schema = yup.object().shape({
	seller_order_id: yup.string(),
	status: yup.string()
})

interface Props {
	setQuery: React.Dispatch<React.SetStateAction<QueryListFulfillmentOrderDto>>
}

export default function FilterTransaction({ setQuery }: Props) {
	const {
		control,
		handleSubmit,

		reset
	} = useForm<Partial<ListFulfillmentOrderItemDto>>({
		mode: 'onTouched',
		resolver: yupResolver(schema),
		defaultValues: {}
	})

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
	const { t } = useTranslation('balance')

	return (
		<form onSubmit={onSubmit} className="flex gap-2  items-center my-2">
			<BaseInput
				labelPlacement="outside"
				label={t('label.seller_order_id')}
				// placeholder="Enter name"
				control={control}
				name="seller_order_id"
				className="min-w-[240px]"
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
						seller_order_id: '',
						status: ''
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
