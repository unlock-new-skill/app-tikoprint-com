import { ApiException } from '@api/base/base-service.dto'
import {
	SaveShopCollectionDto,
	shopCatalogCollectionService,
	ShopCollectionDto
} from '@api/shopCatalogCollectionService'
import { uploadFileService } from '@api/uploadFileService'
import { BaseInput, BaseSwitch } from '@components/data-input'
import UploadImage from '@components/data-input/UploadImage'
import yup from '@helper/yup-valiator'
import { yupResolver } from '@hookform/resolvers/yup'
import {
	Button,
	CircularProgress,
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@nextui-org/react'
import { useRequest } from 'ahooks'
import { useFieldArray, useForm } from 'react-hook-form'
import { MdDeleteOutline } from 'react-icons/md'
import { toast } from 'react-toastify'

export default function CollectionForm() {
	const { data, loading } = useRequest(shopCatalogCollectionService.list, {
		defaultParams: [{ pageSize: 1000, page: 1 }]
	})
	const initData =
		data?.data?.data?.dataTable?.map(i => ({
			label: i.label,
			thumnail: i.thumnail,
			isWebMenu: i.isWebMenu,
			isTrending: i.isTrending
		})) ?? []

	return loading || !data?.data ? (
		<div className="flex justify-center items-center min-h-[60vh]">
			<CircularProgress />
		</div>
	) : (
		<Form initData={initData} />
	)
}

const schema = yup.object().shape({
	collections: yup
		.array()
		.of(
			yup.object().shape({
				label: yup.string().required('Required'),
				thumnail: yup.string().required('Required'),
				isWebMenu: yup.boolean().required('Required'),
				isTrending: yup.boolean().required('Required')
			})
		)
		.required()
})

interface FormProps {
	initData: Partial<ShopCollectionDto>[]
}
export function Form({ initData }: FormProps) {
	const {
		handleSubmit,
		control,
		formState: { isSubmitting, isDirty }
	} = useForm<SaveShopCollectionDto>({
		mode: 'onTouched',
		resolver: yupResolver(schema),
		defaultValues: {
			collections: initData
		}
	})

	const onSubmit = handleSubmit(async data => {
		try {
			await shopCatalogCollectionService.saveCollections(data)
			// await authService.register(data)
			toast.success('Save success')
			// router.push(`/auth/login`)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: unknown) {
			if (e instanceof ApiException) {
				toast.error(e.message)
			} else {
				toast.error('An unexpected error occurred')
			}
		}
	})

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'collections'
	})

	return (
		<form onSubmit={onSubmit}>
			<div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 flex-1 overflow-y-scroll max-h-[80vh] py-2 ">
				{fields.map((field, index) => {
					return (
						<div
							key={field.id}
							className="rounded-md border p-2 shadow-sm flex flex-col gap-1"
						>
							<UploadImage
								control={control}
								apiService={uploadFileService.uploadCommonImage}
								name={`collections.${index}.thumnail`}
								label="Thumnail"
								isRequired
								imageClassName="aspect-square"
							/>
							<BaseInput
								control={control}
								name={`collections.${index}.label`}
								isRequired
								label="Name"
							/>
							<div className="flex justify-between items-end">
								<BaseSwitch
									control={control}
									name={`collections.${index}.isTrending`}
									isRequired
									label="Trending"
								/>
								<BaseSwitch
									control={control}
									name={`collections.${index}.isWebMenu`}
									isRequired
									label="Show as menu item"
								/>

								<Popover placement="top">
									<PopoverTrigger>
										<Button
											aria-label="button"
											isIconOnly
											size="sm"
											variant="bordered"
											color="danger"
										>
											<MdDeleteOutline className="text-[1.2rem]" />
										</Button>
									</PopoverTrigger>
									<PopoverContent>
										<div className="px-1 py-2">
											<div className="text-small text-danger-500">
												Delete this collection?
											</div>
											<div className="flex justify-end">
												<Button
													aria-label="button"
													size="sm"
													color="danger"
													variant="flat"
													className="justify-self-end"
													onPress={() =>
														remove(index)
													}
												>
													Delete
												</Button>
											</div>
										</div>
									</PopoverContent>
								</Popover>
							</div>
						</div>
					)
				})}
				<div className="bg-foreground-50 flex items-center justify-center aspect-[2.8/4] rounded-md">
					<Button
						aria-label="button"
						onPress={() => append({} as ShopCollectionDto)}
						variant="bordered"
						color="primary"
					>
						+ New Collection
					</Button>
				</div>
			</div>

			<Button
				aria-label="button"
				type="submit"
				color="primary"
				className="my-2"
				isDisabled={!isDirty}
			>
				{!isSubmitting && 'Save'}
			</Button>
		</form>
	)
}
