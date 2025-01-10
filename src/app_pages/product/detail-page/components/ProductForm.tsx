import {
	BaseInput,
	BaseSelectWithApi,
	BaseSwitch,
	RichTextEditor,
	UploadMultipleImage,
	UploadVideo
} from '@components/data-input'
import { useProductDetailForm } from '../hooks/useProductDetailForm'
import { uploadFileService } from '@api/uploadFileService'
import {
	QueryShopCollectionDto,
	shopCatalogCollectionService,
	ShopCollectionDto
} from '@api/shopCatalogCollectionService'
import { Button, CircularProgress, Divider } from '@nextui-org/react'
import SelectTag from './SelectTag'
import { useParams } from 'next/navigation'
import { useRequest } from 'ahooks'
import { shopProductService } from '@api/shopProductService'
import { useEffect } from 'react'
import UploadImage from '@components/data-input/UploadImage'
// import { ShopTagDto } from '@api/shopCatalogTagService'

export default function ProductForm() {
	const p = useParams()
	const { run, data, loading } = useRequest(shopProductService.find, {
		manual: true
	})
	useEffect(() => {
		if (p?.id && p?.id !== 'new') {
			run(p?.id as string)
		}
	}, [p, run])

	const initFormData = data?.data?.data
		? {
				id: data.data.data?.id,
				size_chart: data.data.data?.size_chart,
				name: data.data.data?.name,
				description: data.data.data?.description,
				collectionId: data.data.data?.collectionId,
				video: data.data.data?.video,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				tags: data.data.data?.tags.map((i: any) => i.shopTagId),
				images: [
					...data.data.data?.images.map((i, index) => ({
						id: `image-${index}`,
						url: i
					})),
					...Array(9 - data.data.data?.images?.length)
						.fill('_')
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
						.map((i, index) => ({
							id: `image-${(data.data.data?.images?.length as number) + index}`,
							url: null
						}))
				],
				isActive: data.data.data?.isActive
		  }
		: null

	return loading ? (
		<div className="h-[50vh] flex justify-center items-center">
			<CircularProgress />
		</div>
	) : (
		<FormEdit initData={initFormData} />
	)
}

export interface FormEditProductProps {
	initData: {
		id: string
		name: string
		video?: string
		description: string
		collectionId: string
		images: { id: string; url: string | null }[]
		isActive: boolean | undefined
	} | null
}
function FormEdit({ initData }: FormEditProductProps) {
	const {
		methodForm: {
			control,
			formState: { isDirty, isSubmitting }
		},
		onSubmit
	} = useProductDetailForm({ initData })

	return (
		<form onSubmit={onSubmit} className="grid gap-2 xl:gap-2 grid-cols-1 max-w-[900px]">
			<BaseInput
				control={control}
				name="name"
				label="Product Name"
				isRequired
				labelPlacement="outside"
				placeholder="Enter Product name"
			/>
			<BaseSwitch
				control={control}
				name="isActive"
				label="Is Active (Show for buyer)"
				isRequired
				labelPlacement="outside"
			/>
			<BaseSelectWithApi<QueryShopCollectionDto, ShopCollectionDto>
				label="Collection"
				isRequired
				placeholder="Select"
				apiService={shopCatalogCollectionService.list}
				control={control}
				name="collectionId"
				valuePath="id"
				labelPath="label"
				searchKey="label"
				labelPlacement="outside"
			/>
			<SelectTag control={control} name="tags" label="Tags" isRequired={false} />

			<UploadMultipleImage
				apiService={uploadFileService.uploadProductImage}
				control={control}
				name="images"
				label="Images - (first image will become thumnail)"
				slot={9}
				isRequired
				imageClassName="aspect-[4/5]"
			/>
			<Divider className="my-2" />
			<div className="flex gap-2 md:gap-3  ">
				<UploadVideo
					control={control}
					name="video"
					isRequired={false}
					apiService={uploadFileService.uploadProductVideo}
					imageClassName="aspect-[4/5] "
					containerClassName="w-full md:max-w-[260px] pl-2"
					label="Video"
				/>
				<UploadImage
					label="Size Chart"
					name="size_chart"
					isRequired={false}
					apiService={uploadFileService.uploadProductImage}
					control={control}
					imageClassName="aspect-[4/5] w-[260px]  mt-1"
				/>
			</div>

			<RichTextEditor control={control} name="description" label="Description" isRequired />

			<Button
				aria-label="button"
				type="submit"
				color="primary"
				isDisabled={!isDirty}
				isLoading={isSubmitting}
			>
				Save
			</Button>
		</form>
	)
}
