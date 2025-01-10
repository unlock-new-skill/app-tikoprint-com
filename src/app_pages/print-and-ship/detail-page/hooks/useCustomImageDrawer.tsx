/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { compareJSONObjects } from '@helper/stringHelper'
import { useRequest } from 'ahooks'

import clsx from 'clsx'
import React, { ChangeEvent, memo, useEffect, useMemo, useRef, useState } from 'react'
import { FaUpload } from 'react-icons/fa'
import { FaTrash } from 'react-icons/fa6'
// import { MdVerticalAlignCenter } from 'react-icons/md'
// import { Rnd } from 'react-rnd'
// import MyDesign from '../components/MyDesign'
import {
	AttributeAttributeOption,
	AvaiableProductDto,
	AvaiableProductModelConfig,
	AvaiableProductModelImage,
	ProductAttributeOptionConfig
} from '@api/fulfillmentService'
import {
	Alert,
	Button,
	Checkbox,
	CircularProgress,
	Drawer,
	DrawerBody,
	DrawerContent,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Switch
} from '@nextui-org/react'
import { TFunctionNonStrict } from 'i18next'
import { uploadFileService } from '@api/uploadFileService'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { OrderProductItemDto } from '../components/Items'
import { getClassificationText } from '@helper/orderHelper'

interface FramModelPropsDto {
	modelImages: AvaiableProductModelImage[]
	selectedColor: string
	setUserModelImage: React.Dispatch<React.SetStateAction<AvaiableProductModelImage[]>>
	designData: any
	setDesignData: any
}
const FrameModel = memo(function FrameModel({
	modelImages = [],
	selectedColor,
	setUserModelImage
}: // designData,
// setDesignData
FramModelPropsDto) {
	const { t } = useTranslation('fulfillment')
	const [showFrame, setShowFrame] = useState(true)
	// const [showDesignBorder, setShowDesignBorder] = useState(true)
	const toggleShowFrame = () => setShowFrame(prev => !prev)
	// const toggleShowDesignBroder = () => setShowDesignBorder(p => !p)

	const [side, setSide] = useState(
		modelImages?.find(i => i?.name === 'Front')?.id ?? modelImages[0]?.id
	)
	// console.log('🚀 ~ side:', side)
	const [frameIndex, setFrameIndex] = useState(0)
	const [imageModelData, setImageModelData] = useState<AvaiableProductModelImage[]>(modelImages)
	// console.log('🚀 ~ imageModelData:', imageModelData)

	// useUpdateEffect(() => {
	// 	if (designData) {
	// 		let canApply = true
	// 		designData.forEach(model => {
	// 			const { id, image, name } = model
	// 			if (
	// 				model?.name !== 'Mockup' &&
	// 				!modelImages?.some(
	// 					i => i.id === id && i.image === image && i.name === name
	// 				)
	// 			) {
	// 				canApply = false
	// 			}
	// 		})
	// 		if (!canApply) {
	// 			setDesignData(null)
	// 			return toast.warning(
	// 				'Conflict data, Maybe because the product model has been edited, please update your design to continue using !!!'
	// 			)
	// 		}
	// 		setImageModelData(prev =>
	// 			prev.map(currentModel => {
	// 				const modeToReplace = designData?.find(
	// 					i => i.id === currentModel.id
	// 				)
	// 				return {
	// 					...currentModel,
	// 					config: modeToReplace?.config ?? []
	// 				}
	// 			})
	// 		)
	// 		setDesignData(null)
	// 		toast.success('Design applied')
	// 	}
	// }, [designData])

	useEffect(() => {
		setUserModelImage(imageModelData)
	}, [imageModelData])
	// console.log('🚀 ~ modelImages:', modelImages)

	const [loadingUpload, setLoadingUpload] = useState(false)

	const handleChange = (
		name: string,
		value: string | null,
		model_id: string,
		frame_index: number
	) => {
		// console.log('🚀 ~ handleChange ~ frame_index:', frame_index)
		setImageModelData(prev =>
			prev.map(mapi => {
				if (mapi?.id === model_id) {
					const newConfig = mapi.config.map((config, c_i) => {
						if (c_i === frame_index) {
							return { ...config, [name]: value }
						}
						return config
					})
					return {
						...mapi,
						config: newConfig
					}
				}
				return mapi
			})
		)
	}

	const refUpload = useRef<HTMLInputElement>(null)
	const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
		setLoadingUpload(true)

		try {
			if (!e.target.files || !e?.target?.files[0]) {
				return null
			}
			const file = e.target.files[0]
			const formData = new FormData()

			formData.append('image', file)

			const result = await uploadFileService.uploadFulfillmentDesign(formData)
			handleChange('design_url', result?.data?.data?.original, side, frameIndex)
			handleChange('compress_design_url', result?.data?.data?.compressed, side, frameIndex)
		} catch (e: any) {
			toast.error(t(e?.message ?? 'Unexpected error'))
		}
		if (refUpload?.current) {
			refUpload.current.value = ''
		}
		setLoadingUpload(false)
	}
	const handleDeleteImage = async (side: string, frameIndex: number) => {
		// console.log('🚀 ~ handleDeleteImage ~ frameIndex:', frameIndex)
		// console.log('🚀 ~ handleDeleteImage ~ side:', side)
		handleChange('design_url', null, side, frameIndex)
		handleChange('compress_design_url', null, side, frameIndex)
		toast.success(t('message.deleted'))
	}

	const renderFrame = () => {
		const frameData = imageModelData?.find(i => i?.id === side)
		// console.log('🚀 ~ renderFrame ~ frameData:', frameData)
		return (
			<div
				className={clsx('relative w-[480px] [&>div]:w-full mx-auto', {
					'h-[530px]': !frameData?.image
				})}
			>
				{frameData?.image ? (
					<img
						style={{ backgroundColor: selectedColor }}
						className="w-full"
						src={frameData?.image}
						alt="Template"
					/>
				) : (
					<div className="w-[480px] absolute h-[528px]"></div>
				)}

				{frameData?.config?.map((i: AvaiableProductModelConfig, ix: number) => {
					// console.log('🚀 ~ renderFrame ~ i:', i)
					// const frameSize = {
					// 	width: (600 * i?.width) / 100,
					// 	height: (660 * i?.height) / 100
					// }
					// console.log('🚀 ~ {frameData?.config?.map ~ frameSize:', frameSize)
					return (
						<React.Fragment key={`frame-${ix}`}>
							<div
								key={`frame-${ix}`}
								style={{
									width: `${i?.width ?? 0}%`,
									height: `${i?.height ?? 0}%`,
									top: i?.top ? `${i.top}%` : 'auto',
									left: i?.left ? `${i.left}%` : 'auto'
								}}
								className={clsx('absolute  z-10 ', {
									'outline-2  outline-dashed outline-blue-500': showFrame
								})}
							>
								{i?.compress_design_url?.startsWith('https://') ? (
									<div
										key={`frame-${ix}`}
										className={clsx(
											'absolute flex gap-[1px]  right-0 z-10 -top-10',
											{}
										)}
									>
										<Popover
											color="default"
											title="Are you sure to delete this design ?"
										>
											<PopoverTrigger>
												<Button
													aria-label="button"
													size="sm"
													color="danger"
													isIconOnly
													variant="bordered"
													// className="absolute top-[50%] translate-y-[-50%] -left-2 z-[11]"
												>
													<FaTrash />
												</Button>
											</PopoverTrigger>
											<PopoverContent>
												<div>
													<p>
														{t(
															'title.are_you_sure_to_delete_this_design'
														)}
													</p>
													<div className="flex justify-end mt-2">
														<Button
															aria-label="button"
															size="sm"
															color="danger"
															variant="bordered"
															onPress={() =>
																handleDeleteImage(side, ix)
															}
														>
															{t('button.delete')}
														</Button>
													</div>
												</div>
											</PopoverContent>
										</Popover>
									</div>
								) : null}
								<div className="overflow-hidden w-full h-full relative">
									{i?.design_url ? (
										<img
											src={i?.design_url}
											className="w-full h-full"
											alt="blank"
										/>
									) : (
										// <Rnd
										// 	size={{
										// 		width:
										// 			i?.design_size?.width ??
										// 			100,
										// 		height:
										// 			i?.design_size
										// 				?.height ?? 100
										// 	}}
										// 	position={{
										// 		x:
										// 			i?.design_position?.x ??
										// 			20,
										// 		y:
										// 			i?.design_position?.y ??
										// 			20
										// 	}}
										// 	onDragStop={(e, d) => {
										// 		handleChange(
										// 			'design_position',
										// 			{ x: d.x, y: d.y },
										// 			side,
										// 			ix
										// 		)
										// 	}}
										// 	onResizeStop={(
										// 		e,
										// 		direction,
										// 		ref,
										// 		delta,
										// 		position
										// 	) => {
										// 		handleChange(
										// 			'design_size',
										// 			{
										// 				width: ref.style
										// 					.width,
										// 				height: ref.style
										// 					.height
										// 			},
										// 			side,
										// 			ix
										// 		)
										// 	}}
										// >
										// 	<img
										// 		src={i?.design_url}
										// 		className={clsx(
										// 			'w-full h-full',
										// 			{
										// 				'outline outline-gray-200':
										// 					showDesignBorder
										// 			}
										// 		)}
										// 	/>
										// </Rnd>
										<>
											<Button
												aria-label="button"
												size="sm"
												variant="bordered"
												color="primary"
												isLoading={loadingUpload && ix === frameIndex}
												onPress={() => {
													setFrameIndex(ix)
													if (refUpload?.current) {
														refUpload.current.click()
													}
												}}
												className="absolute top-[40%] left-[50%] translate-x-[-50%]"
											>
												<FaUpload className="text-[#1677ff]" />
												File
											</Button>
										</>
									)}
								</div>
							</div>
						</React.Fragment>
					)
				})}
				<input
					ref={refUpload}
					onChange={e => handleUpload(e)}
					type="file"
					className="hidden"
				/>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-4 w-[620px]">
			<div className="flex justify-between bg-foreground-100 py-[6px] px-2">
				<div className="flex gap-2 items-center">
					{['Front', 'Back', 'Right', 'Left', 'Mockup']
						.map((placement: string) => {
							const i: AvaiableProductModelImage | undefined = modelImages?.find(
								i => i?.name === placement
							)
							if (i) {
								return i
							}
							return null
						})
						.filter(i => i)
						.map(i => (
							<Button
								aria-label="button"
								size="sm"
								key={`button-${i?.id}`}
								onPress={() => setSide(i?.id as string)}
								color={side === i?.id ? 'primary' : 'default'}
							>
								{t(`label.${i?.name}`)}
							</Button>
						))}
				</div>
				<div className="flex gap-2">
					{/* <div className="flex gap-2 items-center flex-col">
							<span>Design border</span>
							<Switch
								checked={showDesignBorder}
								onChange={toggleShowDesignBroder}
							/>
						</div> */}
					<div className="flex gap-2 items-center ">
						<span className="text-[0.7rem]">Show Frame</span>
						<Switch isSelected={showFrame} onChange={toggleShowFrame} />
					</div>
				</div>
			</div>
			{/* <div className="h-[1px] bg-slate-300 w-full"></div> */}

			{renderFrame()}
		</div>
	)
})

interface useCustomImageDrawerPropsDto {
	handleAddProduct: (a: OrderProductItemDto) => boolean
	handleCloseProductDrawer: () => void
	t: TFunctionNonStrict<'fulfillment', undefined>
}
export const useCustomImageDrawer = (props: useCustomImageDrawerPropsDto) => {
	const { handleAddProduct: handleAddProductToTable, handleCloseProductDrawer, t } = props

	const { loading: loadingUI, run: runLoadingRerender } = useRequest(
		async () => new Promise(resolve => setTimeout(resolve, 600)),
		{
			manual: true
		}
	)

	const [open, setOpen] = useState(false)
	const [printOption, setPrintOption] = useState<'ANY' | 'DTG'>('ANY')
	const [product, setProduct] = useState<AvaiableProductDto | null>(null)
	// console.log('🚀 ~ useCustomImageModal ~ product:', product)
	const [selectedAttributes, setSelectedAttributes] = useState<{
		[key: string]: any
	}>({})
	// console.log('🚀 ~ useCustomImageModal ~ selectedAttributes:', selectedAttributes)

	const handleSelectAttributes = (attributeId: string, attributeOptionId: string) => {
		setSelectedAttributes(prev => ({
			...prev,
			[attributeId]: attributeOptionId
		}))
	}

	const [userModelImage, setUserModelImage] = useState<AvaiableProductModelImage[]>([])

	const [designData, setDesignData] = useState(null)

	// console.log('🚀 ~ useCustomImageModal ~ product:', product)
	const handleOpen = (prod: AvaiableProductDto) => {
		runLoadingRerender()
		setProduct(prod)
		setOpen(true)
	}
	const handleClose = () => {
		setProduct(null)
		setOpen(false)
		setSelectedAttributes({})
		setUserModelImage([])
	}

	const attributesMemo = useMemo(() => {
		return (
			product?.productAttributes?.map(i => {
				const { attributeOptions, name, id } = i?.attribute
				return {
					name,
					attributeOptions,
					id
				}
			}) ?? []
		)
	}, [JSON.stringify(product)])

	const classifications = useMemo(() => {
		return product?.productClassifications ?? []
	}, [JSON.stringify(product)])
	// console.log('🚀 ~ classifications ~ classifications:', classifications)

	const selectedColor = useMemo(() => {
		const colorAttribute = attributesMemo?.find(i => i?.name?.toLowerCase()?.includes('color'))
		if (!colorAttribute) {
			return 'transparent'
		}
		const result = Object.keys(selectedAttributes).reduce((r: string, k: string) => {
			if (k === colorAttribute?.id) {
				const selectedOptionId = selectedAttributes[k]
				return (
					colorAttribute?.attributeOptions?.find(i => i?.id === selectedOptionId)
						?.customValue?.color_code ?? 'transparent'
				)
			}

			return r
		}, 'transparent')

		return result
	}, [JSON.stringify(selectedAttributes), attributesMemo])
	// console.log('🚀 ~ selectedColor ~ selectedColor:', selectedColor)

	const isSelectedAllAttribute = useMemo(() => {
		if (Object.keys(selectedAttributes).length === attributesMemo?.length) {
			return true
		}
		return
	}, [selectedAttributes, attributesMemo])
	// console.log('🚀 ~ useCustomImageModal ~ selectedAttributes:', selectedAttributes)

	const selectedClassification = classifications?.find(i =>
		compareJSONObjects(i?.rawAttributeOptions, selectedAttributes)
	)
	// console.log('🚀 ~ useCustomImageModal ~ selectedClassification:', selectedClassification)

	const handleAddProduct = () => {
		console.log('u', userModelImage)
		const isEmptyDesign = userModelImage.every(m => m.config.every(c => !c.design_url))
		if (isEmptyDesign) {
			toast.warning(t('message.no_design_uploaded'))
			return false
		}

		console.log('🚀 ~ handleAddProduct ~ isEmptyDesign:', isEmptyDesign)
		if (!product || !selectedClassification) {
			return
		}
		const addSuccess = handleAddProductToTable({
			product_code: product.code,
			classification_id: selectedClassification.id,
			quantity: 1,
			userModelData: userModelImage,
			classification: selectedClassification,
			printOption,
			product,
			designs: userModelImage
				.map(m => {
					const emptyDesignSide = m.config.every(c => !c.design_url)
					if (emptyDesignSide) {
						return null
					}
					return {
						side: m.name,
						design_url: m.config.map(i =>
							!i.design_url
								? null
								: {
										design_url: i.design_url,
										compress_design_url: i.compress_design_url as string
								  }
						)
					}
				})
				.filter(i => i !== null),
			ui_render: {
				color_code: selectedColor,
				model_images: product.modelImages,
				name: `${product.name} | ${product.subTitle}`,
				variation: getClassificationText(
					selectedClassification.rawAttributeOptions,
					product.productAttributes
				) as string,
				thumnail: product.avatar
			}
		})
		if (addSuccess) {
			setPrintOption('ANY')
			handleClose()
			handleCloseProductDrawer()
		}
	}
	// console.log('🚀 ~ useCustomImageModal ~ selectedClassification:', selectedClassification)

	const render = () => {
		return (
			<Drawer onClose={handleClose} isOpen={open} size="full">
				<DrawerContent>
					<DrawerBody>
						{!product || loadingUI ? (
							<div className="flex h-[40vh] items-center justify-center">
								<CircularProgress />
							</div>
						) : (
							<div className="flex gap-2">
								<div>
									<div className="bg-foreground-100 shadow-sm border rounded-md py-2">
										<p className="text-center font-[400] text-[1.125rem] text-primary-500">
											{product?.name}
										</p>
										<p className="text-center font-[400]  text-foreground-500">
											{product?.subTitle}
										</p>
									</div>

									<div className="w-[500px]  flex gap-2 flex-col ">
										{attributesMemo?.map((att, index) => {
											// const optionsConfig =
											// 	product?.ProductAttributeOptionConfig?.sort(
											// 		(a, b) =>
											// 			a?.sortIndex - b?.sortIndex
											// 	)

											// console.log(
											// 	'🚀 ~ {attributesMemo?.map ~ configSort:',
											// 	configSort
											// )

											const filterAndSortOptions =
												att?.attributeOptions?.reduce(
													(r: AttributeAttributeOption[], i) => {
														const newResult = r
														const findItemInConfig:
															| ProductAttributeOptionConfig
															| undefined =
															product?.ProductAttributeOptionConfig?.find(
																c =>
																	c?.attributeOptionId ===
																		i?.id && c?.display_status
															)
														if (findItemInConfig) {
															newResult[findItemInConfig?.sortIndex] =
																i
															return newResult
														}
														return newResult
													},
													[]
												)

											return (
												<div
													key={`att-${att?.id}-${index}`}
													className="flex flex-col"
												>
													<p className="font-[600] text-[1.2rem]  my-2">
														{att?.name}
													</p>

													<div className="flex flex-wrap gap-2 p-4 rounded-md bg-slate-200">
														{filterAndSortOptions?.map(option => {
															if (
																att?.name
																	?.toLowerCase()
																	?.includes('color')
															) {
																return (
																	<div
																		key={option.id}
																		onClick={() =>
																			handleSelectAttributes(
																				att?.id,
																				option?.id
																			)
																		}
																		style={{
																			backgroundColor:
																				option?.customValue
																					?.color_code
																		}}
																		className={clsx(
																			'rounded-md	px-2 py-1 drop-shadow-lg  border hover:outline outline-blue-500 cursor-pointer',
																			{
																				outline:
																					Object.values(
																						selectedAttributes
																					)?.includes(
																						option?.id
																					),
																				'text-gray-100': ![
																					'White',
																					'Ivory'
																				].includes(
																					option.value
																				)
																			}
																		)}
																	>
																		{option?.value}
																	</div>
																)
															}
															return (
																<div
																	key={option?.id as string}
																	onClick={() =>
																		handleSelectAttributes(
																			att?.id,
																			option?.id
																		)
																	}
																	className={clsx(
																		'rounded-md outline-blue-500 bg-white drop-shadow-lg p-2 font-bold cursor-pointer min-w-[32px] text-center  hover:outline',
																		{
																			outline: Object.values(
																				selectedAttributes
																			)?.includes(option?.id)
																		}
																	)}
																>
																	{option.value}
																</div>
															)
														})}
													</div>
												</div>
											)
										})}

										{!isSelectedAllAttribute && (
											<Alert
												color="primary"
												title={t(
													'message.select_all_attribute_to_view_price'
												)}
												description={null}
											/>
										)}

										{isSelectedAllAttribute && !selectedClassification ? (
											<Alert
												color="warning"
												title={t(
													'message.this_variation_is_currently_unavaiable'
												)}
												description={null}
											/>
										) : isSelectedAllAttribute && selectedClassification ? (
											<p className="text-[1.6rem] font-bold text-center bg-blue-100 text-blue-500">
												{t('label.Base_Cost')}:{' '}
												{selectedClassification?.price?.toLocaleString()}$
											</p>
										) : null}

										<Checkbox
											checked={printOption === 'DTG'}
											onChange={e =>
												setPrintOption(e.target.checked ? 'DTG' : 'ANY')
											}
										>
											Print DTG
										</Checkbox>

										<Button
											aria-label="button"
											onPress={handleAddProduct}
											isDisabled={
												!isSelectedAllAttribute || !selectedClassification
											}
											size="lg"
											color="primary"
										>
											+ {t('button.add_this_product')}
										</Button>
									</div>
								</div>
								{/* <MyDesign
											productId={product?.id}
											setDesignData={setDesignData}
										/> */}

								<FrameModel
									setUserModelImage={setUserModelImage}
									// classifications={classifications}
									selectedColor={selectedColor}
									modelImages={[
										...product?.modelImages,
										{
											name: 'Mockup',
											id: 'fake-mockup',
											config: [
												{
													width: 100,
													height: 100,
													top: 0,
													left: 0
												}
											],
											additional_printing_price: 0
										}
									]}
									// selectedAttributes={selectedAttributes}
									designData={designData}
									setDesignData={setDesignData}
								/>

								<p className="text-center flex-1">Your Design (Comming soon)</p>
							</div>
						)}
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		)
	}
	return {
		renderCustomImageDrawer: render,
		handleOpenCustomImageModal: handleOpen,
		handleCloseCustomImageModal: handleClose
	}
}
