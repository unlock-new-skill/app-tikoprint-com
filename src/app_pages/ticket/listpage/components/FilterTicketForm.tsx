import { ApiException } from '@api/base/base-service.dto'
import { QueryListFulfillmentOrderDto } from '@api/fulfillmentService'
import { BaseInput, BaseSelect } from '@components/data-input'
import { Button } from '@nextui-org/react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FaSearch } from 'react-icons/fa'
import { FaFilterCircleXmark } from 'react-icons/fa6'
import { toast } from 'react-toastify'

interface Props {
	setQuery: React.Dispatch<React.SetStateAction<QueryListFulfillmentOrderDto>>
}

export default function FilterTicketForm({ setQuery }: Props) {
	const {
		control,
		handleSubmit,
		watch,
		reset
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} = useForm<any>({
		mode: 'onTouched'
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
	const { t } = useTranslation('ticket')

	return (
		<form onSubmit={onSubmit} className="flex gap-2  items-center my-2">
			<BaseInput
				labelPlacement="outside"
				label={t('label.title')}
				// placeholder="Enter name"
				control={control}
				name="title"
				className="min-w-[240px]"
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
						label: 'OPENING',
						value: 'OPENING'
					},
					{
						label: 'CLOSE',
						value: 'CLOSE'
					}
				]}
				className="min-w-[170px]"
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
						title: undefined,
						status: undefined,
						sort: 'createdAt',
						dir: 'desc'
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
