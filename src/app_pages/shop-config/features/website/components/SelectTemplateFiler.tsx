import { ApiException } from '@api/base/base-service.dto'
import {
	QueryListShopTemplateDto,
	ShopTemplateDto
} from '@api/shopTemplateService'
import { BaseInput } from '@components/data-input'
import yup from '@helper/yup-valiator'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@nextui-org/react'
import { useForm } from 'react-hook-form'
import { FaSearch } from 'react-icons/fa'
import { toast } from 'react-toastify'

const schema = yup.object().shape({
	name: yup.string(),
	alias: yup.string()
})

interface Props {
	setQuery: React.Dispatch<React.SetStateAction<QueryListShopTemplateDto>>
}

export default function SelectTemplateFiler({ setQuery }: Props) {
	const {
		control,
		handleSubmit,
		formState: { isDirty }
	} = useForm<Partial<ShopTemplateDto>>({
		mode: 'onTouched',
		resolver: yupResolver(schema)
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
		<form onSubmit={onSubmit} className="flex gap-2 items-center my-2">
			<BaseInput
				className="w-max"
				label="Template name"
				control={control}
				name="name"
				isRequired={false}
			/>
			<BaseInput
				className="w-max"
				label="Alias"
				control={control}
				name="alias"
				isRequired={false}
				size="sm"
			/>
			<Button
				aria-label="button"
				size="lg"
				isDisabled={!isDirty}
				type="submit"
				color="primary"
				variant="bordered"
			>
				<FaSearch /> Search
			</Button>
		</form>
	)
}
