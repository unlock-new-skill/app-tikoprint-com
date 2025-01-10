import { ApiException } from '@api/base/base-service.dto'
import { QueryListPostDto, ShopPostDto } from '@api/shopPostService'
import { BaseInput, BaseSwitch } from '@components/data-input'
import yup from '@helper/yup-valiator'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@nextui-org/react'
import { useForm } from 'react-hook-form'
import { FaSearch } from 'react-icons/fa'
import { toast } from 'react-toastify'

const schema = yup.object().shape({
	title: yup.string(),
	active: yup.boolean()
})

interface Props {
	setQuery: React.Dispatch<React.SetStateAction<QueryListPostDto>>
}

export default function FormFilterPost({ setQuery }: Props) {
	const {
		control,
		handleSubmit,

		reset
	} = useForm<Partial<ShopPostDto>>({
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

	return (
		<form onSubmit={onSubmit} className="flex gap-2  items-center my-2">
			<BaseInput
				labelPlacement="outside"
				label="Title"
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
