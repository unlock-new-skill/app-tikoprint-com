import clsx from 'clsx'
import { GridListProps } from './gridlist.dto'
import { useRequest } from 'ahooks'
import { useMemo, useState } from 'react'
import { CircularProgress, Pagination } from '@nextui-org/react'
import { CommonPagingProps } from '@api/base/BaseService'

export default function GridList<DataDto, FilterQueryDto extends CommonPagingProps>(
	props: GridListProps<DataDto, FilterQueryDto>
) {
	const { apiService, gridClassName, renderCard, defaultQuery, renderForm } = props

	const [query, setQuery] = useState<FilterQueryDto>(
		defaultQuery || ({ page: 1, pageSize: 10 } as unknown as FilterQueryDto)
	)
	const [refresh, setRefresh] = useState(false)
	const triggerRefreshList = () => {
		setRefresh(p => !p)
	}

	const { data, loading } = useRequest(() => apiService(query), {
		refreshDeps: [JSON.stringify(query), refresh]
	})

	const mapData: DataDto[] = useMemo(() => {
		if (!data) {
			return []
		}
		return data.data.data.dataTable
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(data)])

	return (
		<div className="flex flex-col gap-2  min-h-[40vh] ">
			{renderForm && renderForm(setQuery)}
			<div
				className={clsx(
					'relative',
					gridClassName ??
						'grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grd-cols-4 2xl:grid-cols-6 '
				)}
			>
				{mapData.map(i => renderCard(i, triggerRefreshList))}
			</div>
			<div className="py-2 flex items-center gap-2 justify-center">
				{data?.data && (
					<>
						<Pagination
							color="primary"
							initialPage={query.page}
							total={Math.ceil((data?.data?.data?.totalCount ?? 0) / query.pageSize)}
							page={query?.page}
							onChange={newPage => setQuery(p => ({ ...p, page: newPage }))}
						/>
						<p className="border border-primary-500 px-4 py-1 rounded-md text-primary-500">
							Found: {data?.data?.data?.totalCount} result
						</p>
					</>
				)}
			</div>

			<div
				className={clsx(
					'absolute top-0 left-0 bg-foreground-100 opacity-60 w-full h-full z-[1] flex items-center justify-center',
					{ hidden: !loading }
				)}
			>
				<CircularProgress />
			</div>
		</div>
	)
}
