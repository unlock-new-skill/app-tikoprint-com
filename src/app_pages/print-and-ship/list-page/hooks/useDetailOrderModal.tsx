import { fulfillmentService, ListFulfillmentOrderItemDto } from '@api/fulfillmentService'
import ProductImageWithDesign from '@app_pages/print-and-ship/detail-page/components/ProductImageWithDesign'
import { getClassificationText } from '@helper/orderHelper'
import {
	Button,
	Chip,
	CircularProgress,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader
} from '@nextui-org/react'
import { useRequest } from 'ahooks'
// import moment from 'moment'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaCopy } from 'react-icons/fa'
import { toast } from 'react-toastify'

export default function useDetailOrderModal() {
	const [open, setOpen] = useState(false)

	const [order, setOrder] = useState<ListFulfillmentOrderItemDto | null>(null)
	console.log('🚀 ~ order:', order)
	const { t } = useTranslation('fulfillment')
	const { data, run, loading } = useRequest(fulfillmentService.find, {
		manual: true,
		onError: () => toast.error(t('message.unexpected_error'))
	})

	const handleOpen = (id: string, order: ListFulfillmentOrderItemDto) => {
		console.log('🚀 ~ handleOpen ~ order:', order)
		setOrder(order)
		setOpen(true)
		run(id)
	}
	const handleClose = () => {
		setOrder(null)
		setOpen(false)
	}
	const render = () => {
		return (
			<Modal isOpen={open} onClose={handleClose} size="3xl">
				<ModalContent>
					{loading ? (
						<div className="flex items-center justify-center min-h-[300px]">
							<CircularProgress />
						</div>
					) : (
						<>
							<ModalHeader className="flex gap-2 items-center justify-center">
								<p>
									{t('title.order_id')}: {data?.data?.data?.orderCode}
								</p>
								<Chip
									color={data?.data?.data?.print_only ? 'primary' : 'secondary'}
								>
									{data?.data?.data?.print_only
										? t('label.print_only')
										: t('label.print_and_ship')}
								</Chip>
								{/* {data?.data?.data?.print_only && (
									<Button
										size="sm"
										// onClick={downloadLabel}
										color="primary"
									>
										<FaDownload />
										PDF
									</Button>
								)} */}
							</ModalHeader>
							<ModalBody className="flex gap-2">
								<div className="grid grid-cols-1  gap-2 col-span-2">
									<p>
										{t('label.payment_transaction')}:{' '}
										{order?.payment_transaction?.Transaction?.id}
										{'   '}
										<span
											className={
												order?.payment_transaction?.Transaction.status ===
												'SUCCESS'
													? 'text-success-500'
													: 'text-danger-500'
											}
										>
											[{order?.payment_transaction?.Transaction?.status}]
										</span>
									</p>
									{order?.refund_transaction && (
										<p>
											{t('label.refund_transaction')}:{' '}
											{order?.refund_transaction?.Transaction?.id}
											{'   '}
											<span
												className={
													order?.refund_transaction?.Transaction
														.status === 'SUCCESS'
														? 'text-success-500'
														: 'text-danger-500'
												}
											>
												[{order?.refund_transaction?.Transaction?.status}]
											</span>
										</p>
									)}
									{/* <b className="text-[1.2rem]">Item(s)</b> */}
									{data?.data?.data?.Items?.map((item, index) => {
										const classificationText = getClassificationText(
											item?.classification?.rawAttributeOptions,
											item?.product?.productAttributes,
											true
										) as {
											name: string
											value: string
										}[]
										// console.log('🚀 ~ {order?.Items?.map ~ classificationText:', classificationText)

										return (
											<div
												key={`${item.product?.id}-${index}`}
												className="flex flex-col gap-2 "
											>
												<p className="py-2">
													<Chip
														color="secondary"
														size="sm"
														className="mr-1"
													>
														{index + 1}
													</Chip>
													<span className="font-bold text-[#1677ff] text-[1rem] mr-2">
														Qty: {item?.quantity}
													</span>
													{item?.product?.name} -
													{t('label.classification')}:{' '}
													{classificationText?.map((cls, clsIndex) => (
														<span
															className="font-[600]"
															key={`${item.product?.id}-${index}-${clsIndex}-cls`}
														>
															{cls?.name} :
															<span className=" underline text-[#1677ff] text-[1rem] px-1">
																{' '}
																{cls?.value}
															</span>{' '}
														</span>
													))}
												</p>
												<div className="flex flex-wrap gap-2  border p-4 rounded-md">
													{item?.rawUserModelImages?.map(
														(rawModel, index) => {
															return (
																<ProductImageWithDesign
																	color={
																		item?.modelColorCode as string
																	}
																	data={rawModel}
																	boxWidth={120}
																	renderCompress={true}
																	key={item.id + String(index)}
																	showDownload={true}
																/>
															)
														}
													)}
												</div>
											</div>
										)
									})}
								</div>

								<div className="grid grid-cols-1 divide-y divide-foreground-100 gap-2 h-fit">
									<div className="flex justify-between">
										<span>{t('label.seller_order_id')}: </span>
										<span className="font-[600] text-[1rem]">
											{data?.data?.data?.seller_order_id ?? '...'}
										</span>
									</div>
									<div className="flex justify-between pt-2">
										<span>{t('label.status')}: </span>
										<span className="font-[600] text-[1rem]">
											{data?.data?.data?.status}
										</span>
									</div>
									{/* <div className="flex justify-between pt-2">
										<span>Created at: </span>
										<span className="font-[600] text-[1rem]">
											{moment(
												data?.data?.data?.createdAt
											).format('MM/DD/YYYY - hh:mm')}
										</span>
									</div>
									<div className="flex justify-between pt-2">
										<span>Lastest update: </span>
										<span className="font-[600] text-[1rem]">
											{moment(
												data?.data?.data?.updatedAt
											).format('MM/DD/YYYY - hh:mm')}
										</span>
									</div> */}
									<div className="flex justify-between pt-2">
										<span>{t('label.total')}: </span>
										<span className="font-bold text-[1.2rem] text-blue-500">
											{data?.data?.data?.total?.toLocaleString()} $
										</span>
									</div>
									{/* <Divider></Divider> */}
									<p className="bg-foreground-200 p-2 rounded-md shadow-sm">
										{t('label.shipping')}
									</p>
									{/* <div className="flex justify-between pt-2">
								<span>Shipping code (system): </span>
								<span className="font-[600] text-[1rem]">
									{order?.Shipping?.shippingCode}
								</span>
							</div> */}
									<div className="flex justify-between pt-2 gap-2">
										<span>
											<span>{t('label.tracking_code')}:</span>
										</span>
										<span className="font-[600] text-[1rem]">
											{data?.data?.data?.Shipping?.tracking_code ?? '...'}
										</span>
										{/* <Button
									size="sm"
									type="dashed"
									onClick={() => {
										navigator.clipboard.writeText(
											order?.Shipping?.tracking_code
										)
										message.success('Copied')
									}}
								>
									<FaCopy className="text-violet-500" />
								</Button> */}
									</div>
									<div className="flex justify-between pt-2">
										<span>{t('label.shipping_carrier')}: </span>
										<span className="font-[600] text-[1rem]">
											{data?.data?.data?.Shipping?.carrier ?? '...'}
										</span>
									</div>

									{!data?.data?.data?.print_only && (
										<>
											<div className="flex justify-between pt-2">
												<span>{t('label.full_name')}: </span>
												<span className="font-[600] text-[1rem]">
													{data?.data?.data?.Shipping?.first_name}{' '}
													{data?.data?.data?.Shipping?.last_name}
												</span>
											</div>
											<div className="flex justify-between pt-2">
												<span>{t('label.address_1')} </span>
												<span className="font-[600] text-[1rem]">
													{data?.data?.data?.Shipping?.address_1 ?? '...'}
												</span>
												<Button
													size="sm"
													onPress={() => {
														navigator.clipboard.writeText(
															`${data?.data?.data?.Shipping?.address_1} \n ${data?.data?.data?.Shipping?.address_2} \n ${data?.data?.data?.Shipping?.city} \n ${data?.data?.data?.Shipping?.state} \n ${data?.data?.data?.Shipping?.zip_code} \n ${data?.data?.data?.Shipping?.country}`
														)
														toast.success('Copied')
													}}
												>
													<FaCopy className="text-violet-500" />
												</Button>
											</div>
											<div className="flex justify-between pt-2">
												<span>{t('label.address_2')} </span>
												<span className="font-[600] text-[1rem]">
													{data?.data?.data?.Shipping?.address_2 ?? '...'}
												</span>
												{/* <Button
											size="sm"
											type="dashed"
											onClick={() => {
												navigator.clipboard.writeText(
													order?.Shipping?.address_2
												)
												message.success('Copied')
											}}
										>
											<FaCopy className="text-violet-500" />
										</Button> */}
											</div>
											<div className="flex justify-between pt-2">
												<span>
													<span>{t('label.zip_code')}</span>
												</span>
												<span className="font-[600] text-[1rem]">
													{data?.data?.data?.Shipping?.zip_code ?? '...'}
												</span>
											</div>
											<div className="flex justify-between pt-2">
												<span>
													<span>{t('label.city')}</span>
												</span>
												<span className="font-[600] text-[1rem]">
													{data?.data?.data?.Shipping?.city ?? '...'}
												</span>
											</div>
											<div className="flex justify-between pt-2">
												<span>{t('label.state')}: </span>
												<span className="font-[600] text-[1rem]">
													{data?.data?.data?.Shipping?.state ?? '...'}
												</span>
											</div>
										</>
									)}
								</div>
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>
		)
	}

	return {
		handleOpenDetailFulfillmentOrderModal: handleOpen,
		renderDetailFulfillmentOrderModal: render
	}
}
