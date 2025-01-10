/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiDataRes } from '@api/base/base-service.dto'
import { PagingDataDto } from '@api/base/BaseService'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ReactElement, ReactNode } from 'react'

export interface BaseTablePropsDto<DataDto, FilterQueryDto> {
	apiService: (
		query: FilterQueryDto,
		config?: AxiosRequestConfig
	) => Promise<AxiosResponse<ApiDataRes<PagingDataDto<DataDto>>, unknown>>
	gridClassName?: string
	// renderCard: (data: DataDto, triggerRefreshList: () => void) => ReactElement
	defaultQuery?: FilterQueryDto
	renderForm?: (setQuery: React.Dispatch<React.SetStateAction<FilterQueryDto>>) => ReactElement
	columns: BaseTableColumnsDto<DataDto>[]
	key_field: keyof DataDto
	children?: ReactNode
	enable_select_row: boolean
	disable_condition?: (data: DataDto) => boolean
}

export interface BaseTableColumnsDto<DataDto> {
	key: string
	label: string | ReactElement
	render?: (data: any, row: DataDto, refresh: () => void) => ReactElement | string
}
