import { BaseInput, BaseTextarea } from '@components/data-input'
import yup from '@helper/yup-valiator'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Button } from '@nextui-org/react'
import { BasicShopConfigDto, shopConfigService } from '@api/shopConfigService'
import { toast } from 'react-toastify'
import { ApiException } from '@api/base/base-service.dto'
import UploadImage from '@components/data-input/UploadImage'
import { uploadFileService } from '@api/uploadFileService'
import { Dispatch, SetStateAction } from 'react'
const schema = yup.object().shape({
	name: yup.string().required(),
	logo_url: yup.string().required().url(),
	seo_title: yup.string().required(),
	seo_description: yup.string().required().min(50),
	seo_keywords: yup.string().required()
})

interface Props {
	initData: BasicShopConfigDto | null
	setNeedCreateShop: Dispatch<SetStateAction<boolean>>
}

export default function BasicShopInfoForm({
	initData,
	setNeedCreateShop
}: Props) {
	const {
		control,
		handleSubmit,
		formState: { isSubmitting, isDirty }
	} = useForm<BasicShopConfigDto>({
		mode: 'onTouched',
		resolver: yupResolver(schema),
		defaultValues: initData
			? {
					id: initData?.id,
					logo_url: initData?.logo_url,
					name: initData?.name,
					seo_description: initData?.seo_description,
					seo_keywords: initData?.seo_keywords,
					seo_title: initData?.seo_title
			  }
			: {}
	})

	const onSubmit = handleSubmit(async data => {
		try {
			await shopConfigService.saveBasicInfomation(data)
			toast.success('Saved')
			setNeedCreateShop(false)
		} catch (e) {
			if (e instanceof ApiException) {
				toast.error(e.message)
			} else {
				toast.error('An unexpected error occurred')
			}
		}
	})

	return (
		<form
			onSubmit={onSubmit}
			className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-3 "
		>
			<div className="md:col-span-2 flex justify-between items-center">
				<UploadImage
					label="Shop Logo"
					control={control}
					name="logo_url"
					containerClassName="max-w-[120px]"
					isRequired
					imageClassName="aspect-auto max-h-[60px]  rounded-md"
					apiService={uploadFileService.uploadCommonImage}
				/>
				<Button
					aria-label="button"
					type="submit"
					color="primary"
					size="lg"
					className="w-max"
					isLoading={isSubmitting}
					disabled={!isDirty}
				>
					{!isSubmitting && 'Save'}
				</Button>
			</div>

			<BaseInput
				control={control}
				name="name"
				label="Shop Name"
				isRequired
				className="md:col-span-2"
			/>

			<BaseInput
				control={control}
				name="seo_title"
				label="Shop Title (Name, Service or something about your site)"
				isRequired
			/>
			<BaseInput
				control={control}
				name="seo_keywords"
				label="Website Keywords, (Split by , for each, Ex: clothes, tshirt, hoodie)"
				isRequired
			/>
			<BaseTextarea
				control={control}
				name="seo_description"
				label="Description (Min: 50 characters)"
				isRequired
				className="md:col-span-2"
			/>
		</form>
	)
}
