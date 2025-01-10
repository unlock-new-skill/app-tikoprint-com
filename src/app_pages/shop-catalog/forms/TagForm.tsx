import { ApiException } from '@api/base/base-service.dto'
import {
	SaveShopTagDto,
	shopCatalogTagService,
	ShopTagDto
} from '@api/shopCatalogTagService'
import { uploadFileService } from '@api/uploadFileService'
import { BaseInput, ColorPicker } from '@components/data-input'
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

export default function TagForm() {
	const { data, loading } = useRequest(shopCatalogTagService.list, {
		defaultParams: [{ pageSize: 1000, page: 1 }]
	})
	const initData =
		data?.data?.data?.dataTable?.map(i => ({
			label: i.label,
			icon: i.icon,
			color: i.color
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
	tags: yup
		.array()
		.of(
			yup.object().shape({
				label: yup.string().required('Required'),
				icon: yup.string(),
				color: yup.string().required('Required')
			})
		)
		.required()
})

interface FormProps {
	initData: Partial<ShopTagDto>[]
}
export function Form({ initData }: FormProps) {
	const {
		handleSubmit,
		control,
		watch,
		formState: { isSubmitting, isDirty }
	} = useForm<SaveShopTagDto>({
		mode: 'onTouched',
		resolver: yupResolver(schema),
		defaultValues: {
			tags: initData
		}
	})

	const onSubmit = handleSubmit(async data => {
		try {
			await shopCatalogTagService.saveTags(data)
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
		name: 'tags'
	})

	const tagsValues = watch('tags')

	return (
		<form onSubmit={onSubmit}>
			<div className="flex flex-wrap gap-2 flex-1 overflow-y-scroll max-h-[80vh] py-2 ">
				{fields.map((field, index) => {
					const fieldValue = tagsValues[index]
					return (
						<div
							key={field.id}
							className="rounded-md border p-2 shadow-sm flex flex-col gap-1"
						>
							<div className="flex gap-1 items-end">
								<UploadImage
									control={control}
									apiService={
										uploadFileService.uploadCommonImage
									}
									name={`tags.${index}.icon`}
									label="Icon"
									isRequired
									imageClassName="aspect-square max-w-[40px]"
								/>
								<BaseInput
									control={control}
									name={`tags.${index}.label`}
									isRequired
									label="Label"
								/>
							</div>
							<ColorPicker
								control={control}
								name={`tags.${index}.color`}
								isRequired
								label="Color"
							/>
							<p className="text-[0.8rem]">Preview</p>
							<div className="flex justify-between items-end">
								<div
									style={{
										border: `2px solid ${
											fieldValue?.color ?? 'gray'
										}`
									}}
									className="px-3 py-1 rounded-md font-normal flex gap-1"
								>
									{fieldValue?.icon && (
										// eslint-disable-next-line @next/next/no-img-element
										<img
											src={fieldValue?.icon}
											alt="t"
											className="h-[26px]"
										/>
									)}
									{fieldValue.label ?? 'Tag label'}{' '}
								</div>
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
												Delete this Tag?
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

				<div className="bg-foreground-50 flex items-center justify-center min-h-[120px] rounded-md">
					<Button
						aria-label="button"
						onPress={() => append({} as ShopTagDto)}
						variant="bordered"
						color="primary"
					>
						+ New Tag
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
