/* eslint-disable @typescript-eslint/no-explicit-any */

import { useTranslation } from 'react-i18next'
import {
	Button,
	Chip,
	Image,
	Input,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow
} from '@nextui-org/react'
import { useSelectProductDrawer } from '../hooks/useSelectProductDrawer'
import { Control, useFieldArray } from 'react-hook-form'
import {
	AvaiableProductDto,
	AvaiableProductModelImage,
	ProductClassification
} from '@api/fulfillmentService'
import { toast } from 'react-toastify'
import { uniqueId } from 'lodash'
import { MdDelete } from 'react-icons/md'
import ProductImageWithDesign from './ProductImageWithDesign'

interface ItemPropsDto {
	control: Control<any>
}

export interface OrderProductItemDto {
	id?: string
	product_code: string
	classification_id: string
	quantity: number
	designs: {
		side: string
		design_url: ({
			design_url: string
			compress_design_url: string
		} | null)[]
	}[]
	product: AvaiableProductDto
	userModelData: AvaiableProductModelImage[]
	printOption: string
	classification: ProductClassification
	modelColorCode?: string
	ui_render: {
		name: string
		variation: string
		color_code: string
		model_images: AvaiableProductModelImage[]
		thumnail: string
	}
	rawUserModelImages?: AvaiableProductModelImage[]
}
export default function Items({ control }: ItemPropsDto) {
	const { t } = useTranslation('fulfillment')

	const { append, fields, replace, update, remove } = useFieldArray({
		control,
		name: 'items'
	})
	const currentItems = (fields ?? []) as unknown as OrderProductItemDto[]
	const total = currentItems?.reduce(
		(result, item) => {
			return {
				item: result.item + 1,
				quantity: result.quantity + item.quantity,
				price: result.price + item.quantity * item.classification.price
			}
		},
		{
			item: 0,
			quantity: 0,
			price: 0
		}
	)

	const columns = [
		{
			key: 'product',
			label: `${fields.length} ${t('table.column.product')}`
		},
		{
			key: 'quantity',
			label: t('table.column.quantity')
		},
		{
			key: '',
			label: t('table.column.action')
		}
	]
	// console.log('🚀 ~ Items ~ fields:', fields)
	const handleAddProduct = (data: OrderProductItemDto) => {
		// console.log('🚀 ~ handleAddProduct ~ data:', data)
		append(data)

		// const exist = currentItems.find(
		// 	i => data?.classification_id === i.classification_id
		// )

		if (data?.quantity + total?.quantity > 20) {
			toast.info(t('message.maxium_quantity_20'))
			return false
		}
		const newList = [{ ...data, id: uniqueId() }, ...fields]
		replace(newList)
		return true
	}

	const handleChangeQuantity = (qty: string, item_index: number) => {
		if (!Number.isInteger(Number(qty))) {
			toast.error(t('message.invalid_quantity'))
			return false
		}
		const newList = currentItems.map((i, index) => {
			if (item_index === index) {
				return { ...i, quantity: Number(qty) }
			}
			return i
		})

		const totalQuantity = newList.reduce((result, item) => {
			return result + item.quantity
		}, 0)
		if (totalQuantity >= 20) {
			toast.info(t('message.maxium_quantity_20'))
			return false
		}
		update(item_index, newList[item_index])
	}

	const { handleOpenSelectProductDrawer, renderProductDrawer } = useSelectProductDrawer({
		handleAddProduct
	})
	return (
		<>
			<p className="text-center py-1.5 font-normal">{t('title.print_items')}</p>
			<Table
				isStriped
				isHeaderSticky
				aria-label="item table"
				classNames={{
					base: ' border  rounded-2xl max-h-[85vh] overflow-y-scroll',
					table: 'h-full'
				}}
			>
				<TableHeader columns={columns}>
					{column => <TableColumn key={column.key}>{column.label}</TableColumn>}
				</TableHeader>

				<TableBody
					emptyContent={<p className="text-foreground-500">{t('title.empty_product')}</p>}
				>
					{currentItems.map((item, index) => (
						<TableRow key={item.id}>
							<TableCell className="">
								<div className="flex flex-col gap-2 2xl:min-w-[780px]">
									<div className="flex gap-2">
										<Chip
											size="sm"
											color="secondary"
											variant="bordered"
											className="self-center font-bold"
										>
											{index + 1}
										</Chip>
										<Image
											src={item.ui_render.thumnail}
											alt="Thumnail"
											className="w-[40px]"
										/>
										<div className="flex flex-col gap-1">
											<p className="font-normal rounded-md ">
												{item.ui_render.name}
											</p>
											<p className="text-foreground-700 rounded-md bg-foreground-100 px-2">
												{t('label.classification')}:{' '}
												{item.ui_render.variation}
											</p>
										</div>
										{item?.printOption !== 'ANY' && (
											<Chip color="primary" className="w-max">
												{item?.printOption}
											</Chip>
										)}
									</div>

									<div className="flex gap-2">
										{item?.userModelData?.map(i => (
											<ProductImageWithDesign
												key={i?.id}
												data={i}
												color={item?.ui_render.color_code}
												renderCompress
											/>
										))}
									</div>
								</div>
							</TableCell>
							<TableCell>
								<Input
									label={t('label.quantity')}
									isRequired
									type="number"
									min={1}
									max={20}
									placeholder={t('placeholder.quantity')}
									labelPlacement="outside-left"
									defaultValue={String(item.quantity)}
									className="w-max"
									color="primary"
									onChange={e => handleChangeQuantity(e.target.value, index)}
								/>
							</TableCell>
							<TableCell>
								<Popover>
									<PopoverTrigger>
										<Button
											aria-label="button"
											size="sm"
											color="danger"
											variant="bordered"
										>
											{t('button.delete')}
											<MdDelete />
										</Button>
									</PopoverTrigger>
									<PopoverContent>
										<div>
											<p>{t('title.are_you_sure_to_delete')}</p>
											<div className="flex justify-end mt-2">
												<Button
													aria-label="button"
													size="sm"
													color="danger"
													variant="bordered"
													onPress={() => remove(index)}
												>
													{t('button.delete')}
												</Button>
											</div>
										</div>
									</PopoverContent>
								</Popover>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<div className="flex  items-center justify-center mt-2">
				<Button
					aria-label="button"
					size="sm"
					color="primary"
					onPress={handleOpenSelectProductDrawer}
				>
					+ {t('button.add_product')}
				</Button>
			</div>
			{renderProductDrawer()}
		</>
	)
}
