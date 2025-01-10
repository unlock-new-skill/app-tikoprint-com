import {
	Control,
	useController,
	useFieldArray,
	UseFieldArrayReplace,
	UseFormGetValues
} from 'react-hook-form'
import { SaveAttributeAndVariationFormDto, useVariationForm } from '../hooks/useVariationForm'
import { Button, CircularProgress, Divider, Input, Select, SelectItem } from '@nextui-org/react'
import { BaseInput, BaseInputNumber } from '@components/data-input'
import { Fragment, useEffect, useState } from 'react'
import clsx from 'clsx'
import { MdDelete } from 'react-icons/md'
import { useDebounce, useRequest } from 'ahooks'
import { v4 as uuid } from 'uuid'
import { upperFirst } from 'lodash'
import { toast } from 'react-toastify'
import { isNumericString } from '@helper/common'
import { useParams } from 'next/navigation'
import { GetShopProductVariationDto, shopProductService } from '@api/shopProductService'

export default function VariationForm() {
	const p = useParams()
	const { run, data, loading } = useRequest(shopProductService.getVariation, {
		manual: true
	})
	useEffect(() => {
		if (p?.id && p?.id !== 'new') {
			run(p?.id as string)
		}
	}, [p, run])

	const initFormData = data?.data?.data ?? null

	return loading ? (
		<div className="h-[50vh] flex justify-center items-center">
			<CircularProgress />
		</div>
	) : (
		<FormEdit initData={initFormData} />
	)
}

export interface FormEditVariationProps {
	initData: GetShopProductVariationDto | null
}
function FormEdit({ initData }: FormEditVariationProps) {
	const {
		methodForm: {
			control,
			formState: { isDirty, isSubmitting },
			watch,
			getValues
		},
		onSubmit
	} = useVariationForm({ initData })

	const attributes = useDebounce(watch('attributes'), { wait: 500 })

	return (
		<form onSubmit={onSubmit} className="max-w-[1000px]">
			<p className="font-[400] text-[1rem] my-2">Attributes</p>
			<Attribute control={control} name="attributes" />

			<p className="font-[400] text-[1rem] mt-12 mb-2">Variations & Pricing setup</p>

			<Variation
				control={control}
				name="variations"
				attributes={attributes}
				getValues={getValues}
			/>
			<Divider className="my-2" />
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

interface AttributeProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: Control<any, any>
	name: string
}

function Attribute({ control, name }: AttributeProps) {
	const { append, fields, remove } = useFieldArray({
		control,
		name
	})
	return (
		<div className="flex flex-col gap-2 ">
			{fields.map((field, index) => {
				return (
					<div key={field.id} className="rounded-md border p-2 flex flex-col gap-1">
						<div className="flex items-center gap-2">
							<BaseInput
								control={control}
								name={`${name}.${index}.name`}
								isRequired
								label="Name"
							/>
							<Button
								aria-label="button"
								isIconOnly
								color="danger"
								onPress={() => remove(index)}
							>
								<MdDelete />
							</Button>
						</div>
						<p className="text-[0.8rem] my-1">Options:</p>
						<AttributeOptions control={control} name={`${name}.${index}.value`} />
					</div>
				)
			})}
			{fields?.length < 2 && (
				<Button
					aria-label="button"
					onPress={() => append({ name: '', value: [{ v: '' }] } as unknown)}
					variant="bordered"
					color="primary"
					className="w-max"
				>
					+ Add Attribute
				</Button>
			)}
		</div>
	)
}

function AttributeOptions({ control, name }: AttributeProps) {
	const { append, fields, remove } = useFieldArray({
		control,
		name
	})
	const [isEdit, setIsEdit] = useState(true)
	return (
		<>
			<div className="flex flex-wrap gap-2">
				{fields.map((field, index) => {
					return (
						<div
							key={field.id}
							className={clsx('flex gap-2 items-end', {
								'w-full': isEdit
							})}
						>
							<BaseInput
								control={control}
								name={`${name}.${index}.v`}
								isRequired
								label={`Option ${index + 1}`}
								placeholder="Enter option label"
								variant={isEdit ? 'flat' : 'bordered'}
								isReadOnly={!isEdit}
								isDisabled={!isEdit}
								labelPlacement="outside"
							/>
							{isEdit && (
								<Button
									aria-label="button"
									variant="bordered"
									isIconOnly
									color="danger"
									onPress={() => remove(index)}
									size="sm"
								>
									<MdDelete />
								</Button>
							)}
						</div>
					)
				})}
			</div>
			<div className="flex gap-2 mt-2">
				{isEdit && (
					<Button
						aria-label="button"
						onPress={() => append({ v: '' })}
						variant="bordered"
						color="primary"
						size="sm"
					>
						+ Option
					</Button>
				)}
				<Button
					aria-label="button"
					onPress={() => setIsEdit(p => !p)}
					color="primary"
					size="sm"
				>
					{isEdit ? 'Done' : 'Edit'}
				</Button>
			</div>
		</>
	)
}

interface VariationProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: Control<any, any>
	name: string
	attributes: {
		name: string
		value: {
			v: string
		}[]
	}[]
	getValues: UseFormGetValues<SaveAttributeAndVariationFormDto>
}
function Variation({ control, name, attributes, getValues }: VariationProps) {
	// console.log('🚀 ~ Variation ~ attributes:', attributes)
	const { fields, replace } = useFieldArray({
		control,
		name
	})

	const isInvalidAttributes =
		!attributes?.length ||
		attributes[0]?.name.trim().length === 0 ||
		attributes[0]?.value.every(i => i.v === '')

	useEffect(() => {
		if (isInvalidAttributes) return // Không làm gì nếu attributes không hợp lệ

		// Tạo combinations mới
		const currentVariations = getValues('variations')
		const variations = generateCombinations(attributes)
		const newFields = variations.map(variation => {
			console.log('🚀 ~ newFields ~ variation:', variation)
			const existed = currentVariations.find(v => {
				return (
					Object.keys(variation).every(key => v.attributes[key] === variation[key]) &&
					Object.keys(v.attributes).every(key => variation[key] === v.attributes[key])
				)
			})
			// console.log('🚀 ~ newFields ~ existed:', existed)

			return {
				attributes: variation,
				price: existed?.price ?? 0,
				stock: existed?.stock ?? 0,
				id: uuid(),
				v_id: existed?.v_id ?? undefined
			}
		})
		console.log('🚀 ~ newFields ~ newFields:', newFields)

		replace(newFields)
	}, [isInvalidAttributes, JSON.stringify(attributes), replace])

	if (isInvalidAttributes) {
		return (
			<p className="text-foreground-500">
				Please add some attribute or something for classification
			</p>
		)
	}
	return (
		<div className="">
			<BatchEditForm attributes={attributes} getValues={getValues} replace={replace} />
			<div className="grid grid-cols-1 divide-y gap-2 border">
				{fields.map((field, index) => {
					return (
						<div key={field.id} className="	  p-2  flex justify-between gap-2">
							<div className="flex items-center gap-2">
								<VariationAtt
									control={control}
									name={`${name}.${index}.attributes`}
								/>
								<BaseInput
									control={control}
									name={`${name}.${index}.sku`}
									isRequired={false}
									label="SKU"
									placeholder="Enter sku..."
									labelPlacement="outside"
								/>

								<BaseInputNumber
									control={control}
									name={`${name}.${index}.stock`}
									isRequired
									label="Stock"
									labelPlacement="outside"
								/>
								<BaseInputNumber
									control={control}
									name={`${name}.${index}.price`}
									isRequired
									label="Price"
									labelPlacement="outside"
								/>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}

function generateCombinations(
	data: {
		name: string
		value: {
			v: string
		}[]
	}[]
) {
	const result: { [key: string]: string }[] = []

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function combine(current: any, index: number) {
		if (index === data.length) {
			result.push({ ...current })
			return
		}

		const key = data[index].name
		const values = data[index].value

		const uniqueValues = [...new Set(values.map(item => item.v))] // Loại bỏ trùng lặp

		uniqueValues.forEach(value => {
			current[key] = value
			combine(current, index + 1)
		})
	}

	combine({}, 0)
	return result
}

function VariationAtt({ control, name }: AttributeProps) {
	const {
		field: { value }
	} = useController({
		control,
		name
	})

	return (
		<div className={clsx('flex flex-col gap-1')}>
			<label className="text-[0.8rem] text-foreground-500">Variation</label>
			<p className="w-fit font-[400] md:min-w-[240px]">
				{Object.keys(value).map((k: string) => (
					<Fragment key={k}>
						<span className="text-foreground-500">{`${upperFirst(k)}: `}</span>
						<span className="font-[400] mr-2">{value[k]}</span>
					</Fragment>
				))}
			</p>
		</div>
	)
}

interface BatchEditFormProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	replace: UseFieldArrayReplace<any, string>
	getValues: UseFormGetValues<SaveAttributeAndVariationFormDto>
	attributes: {
		name: string
		value: {
			v: string
		}[]
	}[]
}

interface BatchEditFormValue {
	attribute: { [key: string]: string }
	stock: string
	price: string
}

function BatchEditForm({ attributes, getValues, replace }: BatchEditFormProps) {
	const [formValue, setFormValue] = useState<BatchEditFormValue>({
		attribute: {},
		stock: '',
		price: ''
	})

	const handleChange = (
		key: keyof BatchEditFormValue,
		value: string | boolean,
		attKey?: string
	) => {
		if (key === 'attribute') {
			const currentAtt = formValue.attribute
			setFormValue(p => ({
				...p,
				attribute: {
					...currentAtt,
					[attKey as string]: value as string
				}
			}))
		} else {
			setFormValue(p => ({ ...p, [key]: value }))
		}
	}

	const handeApply = () => {
		if (formValue.price.length === 0 && formValue.stock.length === 0) {
			toast.warning('Please enter stock or price value')
			return
		}
		if (!isNumericString(formValue.price)) {
			toast.warning('Invalid price')
			return
		}
		if (!isNumericString(formValue.price)) {
			toast.warning('Invalid stock amount')
			return
		}

		const currentVariations = getValues('variations')
		const newVariations = currentVariations.map(v => {
			const isMatched = Object.keys(formValue.attribute).every(k => {
				const kValue = formValue.attribute[k]
				return v.attributes[k] === kValue
			})
			const replaceValue: { [key: string]: number | boolean } = {}
			if (formValue.price.length > 0) {
				replaceValue.price = Number(formValue.price)
			}
			if (formValue.stock.length > 0) {
				replaceValue.stock = Number(formValue.stock)
			}

			if (isMatched) {
				return { ...v, ...replaceValue }
			}
			return v
		})
		replace(newVariations)
		toast.success('Apply success')
	}

	return (
		<div className="flex gap-2 mb-2 border drop-shadow-sm rounded-md px-3 py-2">
			<div className="font-[400] text-[0.8rem] self-end w-fit rounded-md border p-2">
				Batch edit
			</div>
			{attributes.map(att => (
				<Select
					onChange={e => handleChange('attribute', e.target.value, att.name)}
					value={formValue.attribute[att.name]}
					labelPlacement="outside"
					placeholder={`Select ${att.name}`}
					size="sm"
					key={att.name}
					label={att.name}
					items={att.value.map(i => ({
						label: i.v,
						value: i.v,
						key: i.v
					}))}
				>
					{option => <SelectItem key={String(option.value)}>{option.label}</SelectItem>}
				</Select>
			))}
			<Input
				value={formValue.stock}
				onChange={e => handleChange('stock', e.target.value)}
				type="number"
				label="Stock"
				labelPlacement="outside"
				placeholder="Enter stock amount"
				size="sm"
			/>
			<Input
				value={formValue.price}
				onChange={e => handleChange('price', e.target.value)}
				type="number"
				label="Price"
				labelPlacement="outside"
				placeholder="Enter price"
				size="sm"
			/>

			<Button
				aria-label="button"
				variant="bordered"
				className="self-end"
				size="sm"
				// color=""
				onPress={() => {
					setFormValue({
						attribute: {},
						stock: '',
						price: ''
					})
				}}
			>
				Clear
			</Button>
			<Button
				aria-label="button"
				variant="bordered"
				className="self-end"
				size="sm"
				color="primary"
				onPress={handeApply}
			>
				Apply
			</Button>
		</div>
	)
}
