import { BaseTablePropsDto } from './dto'
import { useRequest, useUpdateEffect } from 'ahooks'
import React, { createContext, useContext, useMemo, useState } from 'react'
import {
	Pagination,
	Selection,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow
} from '@nextui-org/react'
import { CommonPagingProps } from '@api/base/BaseService'
import { toast } from 'react-toastify'
import { get } from 'lodash'
import { useTranslation } from 'react-i18next'

interface BaseTableContextDto<DataDto> {
	refresh: () => void
	selectedRows: DataDto[]
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BaseTableContext = createContext<BaseTableContextDto<any>>({
	refresh: () => {},
	selectedRows: []
})
export function useBaseTableContext<DataDto>() {
	return useContext<BaseTableContextDto<DataDto>>(BaseTableContext)
}
export default function BaseTable<DataDto, FilterQueryDto extends CommonPagingProps>(
	props: BaseTablePropsDto<DataDto, FilterQueryDto>
) {
	const {
		apiService,
		columns,
		key_field,
		children,
		defaultQuery,
		renderForm,
		enable_select_row,
		disable_condition
	} = props

	const [query, setQuery] = useState<FilterQueryDto>(
		defaultQuery || ({ page: 1, pageSize: 10 } as unknown as FilterQueryDto)
	)

	const { data, loading, refresh } = useRequest(() => apiService(query), {
		refreshDeps: [JSON.stringify(query)],
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		onError: (e: any) => {
			console.log(e)
			toast.error(e?.message ?? 'unexpected error')
		}
	})

	const mapData: DataDto[] = useMemo(() => {
		if (!data) {
			return []
		}
		return data.data.data.dataTable
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(data)])
	const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set([]))

	const disableRows = useMemo(() => {
		if (!disable_condition) {
			return []
		}
		return mapData.filter(i => disable_condition(i)).map(i => get(i, key_field))
	}, [disable_condition, JSON.stringify(mapData)])

	const handleSelectionChange = (keys: Selection) => {
		if (keys === 'all') {
			const allKeys = new Set(
				mapData
					.map(item => get(item, key_field as string))
					.filter(key => !disableRows.includes(key))
			)
			setSelectedKeys(allKeys)
		} else if (keys instanceof Set) {
			const stringKeys = new Set<string>([...keys].map(key => String(key)))
			setSelectedKeys(stringKeys)
		}
	}

	useUpdateEffect(() => {
		setSelectedKeys(new Set([]))
	}, [JSON.stringify(query)])

	const selectedRows = useMemo(() => {
		if (!mapData) {
			return []
		}
		const keys = [...selectedKeys]
		return mapData.filter(i => keys.includes(i[key_field as string]))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedKeys, JSON.stringify(mapData)])
	const { t } = useTranslation('common')

	return (
		<BaseTableContext.Provider value={{ refresh, selectedRows }}>
			<div className="flex flex-col gap-2  min-h-[40vh] ">
				<div className="flex justify-between gap-2 items-center">
					{renderForm && renderForm(setQuery)}
					<p className=" px-4 py-1 rounded-md text-primary-500 h-max self-center font-[400] text-[0.8rem]">
						{data?.data?.data?.totalCount} {t('label.result')}
					</p>
				</div>

				<Table
					aria-label="Controlled table example with dynamic content"
					selectedKeys={selectedKeys}
					selectionMode={enable_select_row ? 'multiple' : 'none'}
					onSelectionChange={handleSelectionChange}
					className="min-h-[300px]"
					disabledKeys={disableRows}
					isStriped
					bottomContent={
						<div className="flex w-full justify-center">
							{query?.page && (
								<Pagination
									initialPage={1}
									color="primary"
									// initialPage={query.page}
									total={Math.ceil(
										(data?.data?.data?.totalCount ?? 0) / query.pageSize
									)}
									page={query?.page}
									onChange={newPage => setQuery(p => ({ ...p, page: newPage }))}
								/>
							)}
						</div>
					}
				>
					<TableHeader columns={columns}>
						{column => <TableColumn key={column.key}>{column.label}</TableColumn>}
					</TableHeader>
					<TableBody
						items={mapData}
						isLoading={loading}
						loadingContent={<Spinner color="secondary" />}
						emptyContent={
							<div className="flex min-h-[300px] justify-center items-center">
								{t('label.no_data_to_display')}
							</div>
						}
					>
						{item => (
							<TableRow key={get(item, key_field as string)}>
								{columnKey => {
									const col_value = get(item, columnKey)
									const col = columns.find(c => c.key === columnKey)
									return (
										<TableCell>
											{col?.render
												? col?.render(col_value, item, refresh)
												: col_value}
										</TableCell>
									)
								}}
							</TableRow>
						)}
					</TableBody>
				</Table>
				{children}
			</div>
		</BaseTableContext.Provider>
	)
}

// function RenderSkeletion() {
// 	return Array(12)
// 		.fill('_')
// 		.map((i, index) => (
// 			<div
// 				key={index}
// 				className="bg-foreground-100  shadow-sm p-2 rounded-md flex flex-col gap-1"
// 			>
// 				<div className="aspect-[1/1]  rounded-md bg-foreground-300 animate-pulse"></div>
// 				<div className="aspect-[7/1] rounded-lg bg-foreground-400 animate-pulse"></div>
// 			</div>
// 		))
// }
