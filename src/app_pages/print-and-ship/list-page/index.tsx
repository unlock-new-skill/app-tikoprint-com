import { fulfillmentService, ListFulfillmentOrderItemDto } from '@api/fulfillmentService'
import BaseTable from '@components/base-table'
import { BaseTableColumnsDto } from '@components/base-table/dto'
import { Button, Chip, Tooltip } from '@nextui-org/react'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { FaCopy, FaFilePdf } from 'react-icons/fa'
import { FaEye, FaMoneyBill } from 'react-icons/fa6'
import { toast } from 'react-toastify'
import FilterListFulfillmentOrder from './components/FilterListFulfillmentOrder'
import useDetailOrderModal from './hooks/useDetailOrderModal'
import usePaymentModal from './hooks/usePaymentModal'
import { TbShoppingCartCancel } from 'react-icons/tb'
import useCancelModal from './hooks/useCancelModal'

export default function ListpagePrintAndShipOrder() {
	const { t } = useTranslation('fulfillment')
	const { handleOpenDetailFulfillmentOrderModal, renderDetailFulfillmentOrderModal } =
		useDetailOrderModal()

	const { handleOpenPaymentModal, renderPaymentModal } = usePaymentModal()

	const { handleOpenCancelModal, renderCancelModal } = useCancelModal()

	async function downloadPdf(url: string, fileName: string) {
		try {
			const response = await fetch(url)
			if (!response.ok) {
				throw new Error(`Failed to fetch file: ${response.statusText}`)
			}
			const blob = await response.blob()
			const blobUrl = window.URL.createObjectURL(blob)
			const anchor = document.createElement('a')
			anchor.href = blobUrl
			anchor.download = fileName + '.pdf'
			document.body.appendChild(anchor)
			anchor.click()
			window.URL.revokeObjectURL(blobUrl)
			document.body.removeChild(anchor)
			console.log(`${fileName} has been downloaded.`)
		} catch (error) {
			console.error('Error downloading the file:', error)
		}
	}

	const colums: BaseTableColumnsDto<ListFulfillmentOrderItemDto>[] = [
		{
			key: 'code',
			label: t('table.column.order_id'),
			render: (orderCode: string) => (
				<div className="flex gap-2 items-center">
					<Button
						size="sm"
						variant="light"
						isIconOnly
						onPress={() => {
							navigator.clipboard.writeText(orderCode as string)
							toast.success('Copied')
						}}
					>
						<FaCopy className="text-secondary-500" />
					</Button>
					<p className="font-normal w-max hover:text-primary-500">{orderCode}</p>
				</div>
			)
		},
		{
			key: 'seller_order_id',
			label: t('label.seller_order_id'),
			render: (id: string) => (
				<div className="flex gap-2 items-center">
					{id?.trim()?.length > 0 && (
						<Button
							size="sm"
							variant="light"
							isIconOnly
							onPress={() => {
								navigator.clipboard.writeText(id as string)
								toast.success('Copied')
							}}
						>
							<FaCopy className="text-secondary-500" />
						</Button>
					)}

					<p className=" w-max hover:text-primary-500">{id}</p>
				</div>
			)
		},
		{
			key: 'total',
			label: t('table.column.total'),
			render: t => `${t} $`
		},
		{
			key: 'print_only',
			label: t('table.column.service'),
			render: (print_only: boolean) => (
				<Chip color={print_only ? 'primary' : 'secondary'} variant="flat">
					{print_only ? t('label.print_only') : t('label.print_and_ship')}
				</Chip>
			)
		},
		{
			key: 'status',
			label: t('table.column.status'),
			render: (status: string, row) => (
				<div>
					{row?.payment_transaction?.Transaction?.status !== 'SUCCESS' &&
					status !== 'CANCELED' ? (
						<p className="text-danger-500">{t('label.not_yet_paid')}</p>
					) : (
						<Chip
							variant="flat"
							color={
								status === 'PREPARE'
									? 'default'
									: status === 'DELIVERED'
									? 'success'
									: status === 'CANCELED'
									? 'danger'
									: 'warning'
							}
						>
							{status}
						</Chip>
					)}
				</div>
			)
		},
		{
			key: 'Shipping',
			label: t('table.column.shipping'),
			render: (shipping: { label_url?: string; tracking_code?: string }, row) => (
				<div className="flex gap-2 items-center">
					{shipping?.tracking_code && (
						<Link
							target="_blank"
							to={`https://tools.usps.com/go/TrackConfirmAction?tRef=fullpage&tLc=2&text28777=&tLabels=${shipping?.tracking_code}%2C&tABt=false`}
						>
							<p className="  text-foreground-500">{shipping?.tracking_code}</p>
						</Link>
					)}
					{shipping?.label_url && (
						<Button
							onPress={() =>
								downloadPdf(shipping?.label_url as string, row?.code as string)
							}
							size="sm"
							color="primary"
							isIconOnly
						>
							<FaFilePdf />
						</Button>
					)}
				</div>
			)
		},
		{
			key: 'created_at',
			label: t('table.column.created_at'),
			render: (created_at: string) => moment(created_at).format('hh:mm MM.DD.YYYY')
		},
		{
			key: 'updated_at',
			label: t('table.column.updated_at'),
			render: (updated_at: string) => moment(updated_at).format('hh:mm MM.DD.YYYY')
		},
		{
			key: 'action',
			label: t('table.column.action'),
			render: (_, row) => (
				<div className="flex gap-2 items-center">
					<Tooltip content={t('label.view_order_info')}>
						<Button
							isIconOnly
							variant="flat"
							color="primary"
							onPress={() => handleOpenDetailFulfillmentOrderModal(row.id, row)}
						>
							<FaEye />
						</Button>
					</Tooltip>
					{row.status !== 'CANCELED' ? (
						<>
							{row?.payment_transaction?.Transaction?.status !== 'SUCCESS' && (
								<Tooltip content={t('label.pay')}>
									<Button
										isIconOnly
										variant="flat"
										color="success"
										onPress={() => handleOpenPaymentModal(row)}
									>
										<FaMoneyBill />
									</Button>
								</Tooltip>
							)}
							{/* {moment().diff(moment(row.createdAt), 'minutes') < 5 ||
							(['SUCCESS']row?.payment_transaction?.Transaction?.status !== 'SUCCESS' && ( */}
							<Tooltip content={t('label.cancel')}>
								<Button
									isIconOnly
									variant="flat"
									color="danger"
									onPress={() => handleOpenCancelModal(row)}
								>
									<TbShoppingCartCancel />
								</Button>
							</Tooltip>
						</>
					) : (
						''
					)}

					{/* ))} */}
				</div>
			)
		}
	]

	return (
		<>
			<div className="flex justify-between items-center">
				<p className="font-normal">{t('title.order_management')}</p>
				<Link to={'/print-and-ship/new-order'}>
					<Button color="primary">{t('button.create_new_order')}</Button>
				</Link>
			</div>
			<BaseTable
				enable_select_row={false}
				apiService={fulfillmentService.list}
				columns={colums}
				key_field={'id'}
				disable_condition={row => row.status === 'CANCELED'}
				renderForm={setQuery => <FilterListFulfillmentOrder setQuery={setQuery} />}
			>
				{renderDetailFulfillmentOrderModal()}
				{renderPaymentModal()}
				{renderCancelModal()}
			</BaseTable>
		</>
	)
}
