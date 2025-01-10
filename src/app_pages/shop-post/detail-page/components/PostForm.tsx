import { BaseInput, BaseSwitch, BaseTextarea, RichTextEditor } from '@components/data-input'
import { useProductDetailForm } from '../hooks/usePostForm'
import { uploadFileService } from '@api/uploadFileService'

import { Button, Divider } from '@nextui-org/react'

import UploadImage from '@components/data-input/UploadImage'
import { useFieldArray } from 'react-hook-form'
import PreviewPost from './PreviewPost'
import { ShopPostDto } from '@api/shopPostService'
import { MdDelete } from 'react-icons/md'
// import { ShopTagDto } from '@api/shopCatalogTagService'

export interface FormEditProductProps {
	initData: ShopPostDto | null
}
export default function PostForm({ initData }: FormEditProductProps) {
	const {
		methodForm: {
			control,
			watch,
			formState: { isDirty, isSubmitting, errors }
		},
		onSubmit
	} = useProductDetailForm({ initData })

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'content'
	})
	console.log('🚀 ~ PostForm ~ errors:', errors)

	const formData = watch()

	return (
		<div className="flex w-full gap-4">
			<form onSubmit={onSubmit} className="grid gap-2 xl:gap-2 grid-cols-1 2xl:w-[900px]">
				<p className="font-[400] text-primary-500">SEO Infomation</p>
				<BaseInput
					control={control}
					name="seoTitle"
					label="Title"
					isRequired
					labelPlacement="outside"
					placeholder="Enter SEO title"
				/>

				<BaseTextarea
					control={control}
					name="seoDescription"
					label="Description"
					isRequired
					labelPlacement="outside"
					placeholder="Enter SEO description"
				/>
				<BaseTextarea
					control={control}
					name="seoKeywords"
					label="Keywords (split by ' , ') ex: hoodie, perfect color print hoodie, ...etc"
					isRequired
					labelPlacement="outside"
					placeholder="Enter SEO description"
				/>
				<BaseSwitch
					control={control}
					name="active"
					label="Active (Show on your page)"
					isRequired
					labelPlacement="outside"
				/>
				<Divider />
				<p className="font-[400] text-primary-500">Post content</p>
				<BaseInput
					control={control}
					name="title"
					label="Title"
					isRequired
					labelPlacement="outside"
					placeholder="Enter post title"
				/>
				<BaseTextarea
					control={control}
					name="description"
					label="Description"
					isRequired
					labelPlacement="outside"
					placeholder="Enter post description"
				/>
				<UploadImage
					apiService={uploadFileService.uploadCommonImage}
					name="thumnail_image"
					label="Thumnail image (Card avatar) - Max 3.5MB"
					imageClassName="aspect-video max-w-[240px]"
					control={control}
					isRequired
				/>
				<UploadImage
					apiService={uploadFileService.uploadCommonImage}
					name="cover_image"
					label="Cover Image - Max 3.5MB"
					imageClassName="w-full min-h-[200px]"
					control={control}
					isRequired={false}
				/>

				<div className="flex flex-col gap-2">
					<p className="font-[400] 	">Sections</p>
					{fields.map((field, index) => {
						return (
							<div
								key={field.id}
								className="rounded-md border p-2 shadow-sm flex flex-col gap-1"
							>
								<BaseInput
									control={control}
									name={`content.${index}.title`}
									isRequired
									label="Section title"
								/>
								<RichTextEditor
									control={control}
									name={`content.${index}.content`}
									label="Section content"
									isRequired
								/>
								<Button
									aria-label="button"
									className="border-dashed w-max self-end"
									variant="bordered"
									color="danger"
									onPress={() => remove(index)}
								>
									<MdDelete />
									Remove section
								</Button>
							</div>
						)
					})}
					<Button
						aria-label="button"
						className="border-dashed w-max"
						variant="bordered"
						color="primary"
						onPress={() => append({ content: '', title: '' })}
					>
						+Add Section
					</Button>
				</div>

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
			<div className="flex-1">
				<div className="sticky top-[64px] shadow-md p-2">
					<PreviewPost {...formData} />
				</div>
			</div>
		</div>
	)
}
