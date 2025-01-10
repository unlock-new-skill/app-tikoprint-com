import { ApiException } from '@api/base/base-service.dto'
import { shopCatalogCollectionService } from '@api/shopCatalogCollectionService'
import { QueryListProductDto, ShopProductDto } from '@api/shopProductService'
import {
	BaseInput,
	BaseSelectWithApi,
	BaseSwitch
} from '@components/data-input'
import yup from '@helper/yup-valiator'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@nextui-org/react'
import { useForm } from 'react-hook-form'
import { FaSearch } from 'react-icons/fa'
import { toast } from 'react-toastify'

const schema = yup.object().shape({
	name: yup.string(),
	isActive: yup.boolean()
})

interface Props {
	setQuery: React.Dispatch<React.SetStateAction<QueryListProductDto>>
}

export default function FormFilterProduct({ setQuery }: Props) {
	const {
		control,
		handleSubmit,

		reset
	} = useForm<Partial<ShopProductDto>>({
		mode: 'onTouched',
		resolver: yupResolver(schema),
		defaultValues: {
			isActive: undefined,
			name: '',
			collectionId: ''
		}
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
				label="Name"
				placeholder="Enter name"
				control={control}
				name="name"
				className="min-w-[240px]"
				isRequired={false}
			/>

			<BaseSelectWithApi
				control={control}
				name="collectionId"
				apiService={shopCatalogCollectionService.list}
				valuePath="id"
				label="Collection"
				labelPath="label"
				isRequired={false}
				searchKey="label"
				labelPlacement="outside"
				placeholder="Choose collection "
				className="min-w-[200px]"
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
				onPress={() =>
					reset({
						isActive: undefined,
						name: '',
						collectionId: ''
					})
				}
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
