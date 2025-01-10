import { ApiException } from '@api/base/base-service.dto'
import { QueryListDiscountDto, ShopDiscountDto } from '@api/shopDiscountService'
import { BaseInput, BaseSwitch } from '@components/data-input'
import yup from '@helper/yup-valiator'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@nextui-org/react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FaSearch } from 'react-icons/fa'
import { toast } from 'react-toastify'

const schema = yup.object().shape({
	code: yup.string()
})

interface Props {
	setQuery: React.Dispatch<React.SetStateAction<QueryListDiscountDto>>
}

export default function FormFilterPost({ setQuery }: Props) {
	const {
		control,
		handleSubmit,

		reset
	} = useForm<Partial<ShopDiscountDto>>({
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
	const { t } = useTranslation('discount')

	return (
		<form onSubmit={onSubmit} className="flex gap-2  items-center my-2">
			<BaseInput
				labelPlacement="outside"
				label={t('code')}
				placeholder="Enter title"
				control={control}
				name="name"
				className="min-w-[240px]"
				isRequired={false}
			/>

			<BaseSwitch
				className="w-max"
				label="Active"
				control={control}
				name="isActive"
				isRequired={false}
			/>
			<Button
				aria-label="button"
				className="self-end"
				size="sm"
				color="default"
				variant="bordered"
				onPress={() => reset({})}
			>
				Clear
			</Button>
			<Button
				aria-label="button"
				className="self-end"
				size="sm"
				type="submit"
				color="primary"
				variant="bordered"
			>
				<FaSearch /> Search
			</Button>
		</form>
	)
}
