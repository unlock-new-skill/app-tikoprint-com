import { TicketDto, ticketService } from '@api/ticketService'
import BaseTable from '@components/base-table'
import { BaseTableColumnsDto } from '@components/base-table/dto'
import { Button, Chip, Tooltip } from '@nextui-org/react'
// import clsx from 'clsx'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { FaEye } from 'react-icons/fa6'
import { Link, useNavigate } from 'react-router-dom'
import FilterTicketForm from './components/FilterTicketForm'

export default function TicketListPasge() {
	const { t } = useTranslation('ticket')
	const navigate = useNavigate()
	const colums: BaseTableColumnsDto<TicketDto>[] = [
		{
			key: 'id',
			label: 'Ticket ID'
		},

		{
			key: 'type',
			label: t('label.type'),
			render: type => (
				<Chip size="sm" variant="flat" color="primary">
					{t(`label.${type}`)}
				</Chip>
			)
		},

		{
			key: 'title',
			label: t('label.title')
			// render: t => t(`label.${t}`)
		},

		{
			key: 'status',
			label: t('label.status'),
			render: status => (
				<Chip variant="flat" color={status === 'OPENING' ? 'success' : 'default'}>
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
			key: 'action',
			label: t('label.action'),
			render: (_, row) => (
				<div className="flex gap-2 items-center">
					<Tooltip content={t('label.view_detail')}>
						<Button
							isIconOnly
							variant="flat"
							color="primary"
							onPress={() => navigate('/ticket/' + row.id)}
						>
							<FaEye />
						</Button>
					</Tooltip>
				</div>
			)
		}
	]

	return (
		<>
			<div className="flex gap-2 justify-between items-center">
				<h3 className=" py-2 font-bold">Ticket</h3>
				<Link to={'/ticket/new'}>
					<Button color="primary">{t('button.create_new_ticket')}</Button>
				</Link>
			</div>
			<BaseTable
				enable_select_row={false}
				apiService={ticketService.list}
				// defaultQuery={{ page: 1, pageSize: 10, sort: 'updatedAt' }}
				columns={colums}
				key_field={'id'}
				renderForm={setQuery => <FilterTicketForm setQuery={setQuery} />}
			>
				{/* {renderDetailFulfillmentOrderModal()} */}
			</BaseTable>
		</>
	)
}
