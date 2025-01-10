/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiDataRes } from '@api/base/base-service.dto'
import { PagingDataDto } from '@api/base/BaseService'
import { UploadImageResDto } from '@api/uploadFileService'
import { SelectionMode } from '@nextui-org/react'
import { AxiosResponse } from 'axios'
import { ReactElement } from 'react'
import { Control } from 'react-hook-form'

export interface BaseProps {
	name: string
	control: Control<any>
	placeholder?: string
	label: string
	labelPlacement?: 'inside' | 'outside' | 'outside-left'
	variant?: 'flat' | 'bordered' | 'underlined' | 'faded'
	color?: 'default' | 'warning' | 'success' | 'secondary' | 'danger' | 'primary'
	size?: 'sm' | 'md' | 'lg'
	startContent?: ReactElement
	endContent?: ReactElement
	isClearable?: boolean
	isRequired: boolean
	isReadOnly?: boolean
	isDisabled?: boolean
	className?: string
	min?: number
}

export interface BaseInputPropDto extends BaseProps {
	type?: 'text' | 'email' | 'password'
}

export interface BaseRadioGroupPropsDto extends BaseProps {
	options: {
		label: string | ReactElement
		value: boolean | number | string
		description?: string | ReactElement
	}[]

	radioClassName?: string

	orientation?: 'horizontal' | 'vertical'
	valueType?: 'string' | 'number' | 'boolean'
}

export interface BaseOptionProps {
	label: string
	value: boolean | number | string
	description?: string | ReactElement
}

export interface BaseSelectPropsDto extends BaseProps {
	options: BaseOptionProps[]
	selectionMode?: SelectionMode
	isMultiline?: boolean
	disabledKeys?: string[]
	renderValue?: (values: any[]) => ReactElement
	customRenderOption?: (option: BaseOptionProps) => ReactElement
}

export interface BaseSelectWithApiPropsDto<QueryDto, DataDto> extends BaseProps {
	searchKey: string
	valuePath: string
	labelPath: string
	apiService: (
		query?: QueryDto
	) => Promise<AxiosResponse<ApiDataRes<PagingDataDto<DataDto>>, any>>

	isMultiline?: boolean
	renderValue?: (values: any[]) => ReactElement
	customRenderOption?: (option: BaseOptionProps) => ReactElement
}

export interface BaseSwitchPropsDto extends BaseProps {
	icon?: ReactElement
}

export interface UploadImagePropsDto {
	name: string
	label: string
	isRequired: boolean
	control: Control<any>
	imageClassName?: string
	containerClassName?: string
	apiService: (
		image: File
	) => Promise<AxiosResponse<ApiDataRes<UploadImageResDto>, unknown>> | null
}

export interface UploadMultipleImagePropsDto {
	name: string
	label: string
	isRequired: boolean
	slot: number
	control: Control<any>
	imageClassName: string
	containerClassName?: string
	apiService: (
		image: File
	) => Promise<AxiosResponse<ApiDataRes<UploadImageResDto>, unknown>> | null
}

export interface BaseDateTimeRangePickerPropsDto extends BaseInputPropDto {
	name: string
	label: string
	isRequired: boolean
	control: Control<any>
	timezone: 'Asia/Ho_Chi_Minh' | 'America/Los_Angeles'
}
