import BaseTable from '@components/base-table'
import { BaseTableColumnsDto } from '@components/base-table/dto'
import { Chip } from '@nextui-org/react'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
// import { Link } from 'react-router-dom'
// import { FaCopy, FaFilePdf } from 'react-icons/fa'
// import { FaEye } from 'react-icons/fa6'
// import { toast } from 'react-toastify'
import { balanceService, TransactionDto } from '@api/balanceService'
// import FilterTransaction from './components/FilterTransaction'
import clsx from 'clsx'
import Balancebox from './components/BalanceBox'
import MoneyChart from './components/MoneyChart'

export default function Balance() {
	const { t } = useTranslation('balance')

	const colums: BaseTableColumnsDto<TransactionDto>[] = [
		{
			key: 'id',
			label: 'ID'
		},

		{
			key: 'amount',
			label: t('label.amount'),
			render: (amount, row) => (
				<Chip
					variant="flat"
					size="sm"
					color={
						row?.status !== 'SUCCESS'
							? 'default'
							: row.type === 'PAYMENT'
							? 'danger'
							: 'success'
					}
				>{`${row.type === 'PAYMENT' ? '-' : '+'} ${amount}`}</Chip>
			)
		},
		{
			key: 'type',
			label: t('label.type')
		},

		{
			key: 'payment_gateway',
			label: t('label.payment_gateway')
		},
		{
			key: 'status',
			label: t('label.status'),
			render: status => (
				<Chip variant="flat" color={status === 'SUCCESS' ? 'success' : 'default'}>
					{status}
				</Chip>
			)
		},

		{
			key: 'system_order.createdAt',
			label: t('label.created_at'),
			render: a => moment(a).format('hh:mm DD.MM.YYYY')
		},
		{
			key: 'description',
			label: t('label.description')
		},

		{
			key: 'change_log',
			label: t('label.change'),
			render: change_log =>
				change_log && (
					<div className="flex flex-col gapo-1">
						<p className="bg-foreground-100 px-2 py-0.5 rounded-md w-max">
							<span
								className={clsx(
									change_log?.before < change_log?.after
										? 'text-green-500'
										: 'text-red-500'
								)}
							>
								{t('label.after')}: {change_log?.after}
							</span>
							{' | '}
							<span>
								{t('label.before')}: {change_log?.before}
							</span>{' '}
						</p>
						<p className="text-foreground-600 text-[0.7rem]">{change_log.time}</p>
					</div>
				)
		}
	]

	return (
		<>
			<h3 className="text-center py-2 font-bold">{t('title.balance')}</h3>
			<div className="flex gap-2">
				<Balancebox />
				<MoneyChart />
			</div>
			<BaseTable
				enable_select_row={false}
				apiService={balanceService.list}
				defaultQuery={{ page: 1, pageSize: 10, sort: 'updatedAt' }}
				columns={colums}
				key_field={'id'}

				// renderForm={setQuery => <FilterTransaction setQuery={setQuery as any} />}
			>
				{/* {renderDetailFulfillmentOrderModal()} */}
			</BaseTable>
		</>
	)
}
