/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { createInstance } from '.'

import { globalApiMiddleware } from './middleware'
import { ApiDataRes } from './base-service.dto'

type MiddlewareFunction = (requestConfig: any) => any

type MiddlewareMap = {
	[key: string]: MiddlewareFunction
}
export interface CommonPagingProps {
	page: number
	pageSize: number
	sort?: string
	dir?: string
}

export interface PagingDataDto<T> {
	dataTable: T[]
	paging: {
		page: number
		pageSize: number
	}
	totalCount: number
}
//ĐỈNH VKL :D
class BaseService<T extends { [key: string]: any }, QueryDto extends CommonPagingProps> {
	BASE_URL = import.meta.env.VITE_BE_URL
	BASE_ENDPOINT = ''
	pimaryKey = 'id'

	paramsGet = {
		sort: 'createdAt',
		dir: 'desc'
	}

	request: AxiosInstance = {} as AxiosInstance

	APPLY_MIDDLEWARE: MiddlewareMap = {
		...globalApiMiddleware
	}

	ALL_ITEMS = 1000

	constructor() {
		this.setRequest()
	}

	setRequest() {
		this.request = createInstance(this.BASE_URL, this.middleware)
	}

	middleware = (requestConfig: any) => {
		const arr = Object.values(this.APPLY_MIDDLEWARE).map(m => {
			if (typeof m === 'function') {
				return m(requestConfig)
			}
			return m
		})
		return arr
	}

	applyMiddleware = (key: any, middleware: any) => {
		this.APPLY_MIDDLEWARE[key] = middleware
	}

	list = async (
		query?: QueryDto,
		config: AxiosRequestConfig = {}
	): Promise<AxiosResponse<ApiDataRes<PagingDataDto<T>>>> => {
		const params = { ...this.paramsGet, ...query }
		return this.request.get<ApiDataRes<PagingDataDto<T>>>(this.BASE_ENDPOINT, {
			params,
			...config
		})
	}

	find = (
		id: string | number,
		config: AxiosRequestConfig = {}
	): Promise<AxiosResponse<ApiDataRes<T | null>>> => {
		const api = `${this.BASE_ENDPOINT}/${id}`
		return this.request.get<ApiDataRes<T | null>>(api, config)
	}

	create = (
		data: Partial<T>,
		config: AxiosRequestConfig = {}
	): Promise<AxiosResponse<ApiDataRes<T>>> => {
		return this.request.post<ApiDataRes<T>>(this.BASE_ENDPOINT, data, config)
	}

	update = (
		data: Partial<T>,
		config: AxiosRequestConfig = {}
	): Promise<AxiosResponse<ApiDataRes<T>>> => {
		const { pimaryKey } = this
		// Ensure `data[pimaryKey]` is a valid value
		const id = data[pimaryKey as keyof T] as string | number
		return this.request.put<ApiDataRes<T>>(`${this.BASE_ENDPOINT}/${id}`, data, config)
	}

	save = (
		data: Partial<T>,
		config: AxiosRequestConfig = {}
	): Promise<AxiosResponse<ApiDataRes<T>>> => {
		const { pimaryKey } = this
		// eslint-disable-next-line no-prototype-builtins
		if (data.hasOwnProperty(pimaryKey) && data[pimaryKey]) {
			return this.update(data, config)
		}
		return this.create(data, config)
	}

	// listWithOptions = (
	// 	query: object = {},
	// 	config: AxiosRequestConfig = {}
	// ): Promise<AxiosResponse<T[]>> => {
	// 	const params = {
	// 		...this.paramsGet,
	// 		page: 1,
	// 		size: this.ALL_ITEMS,
	// 		is_active: true,
	// 		...query
	// 	}
	// 	return this.request.get<T[]>(this.BASE_ENDPOINT, { params, ...config })
	// }

	delete = (
		id: string | number,
		config: AxiosRequestConfig = {}
	): Promise<AxiosResponse<any>> => {
		const api = `${this.BASE_ENDPOINT}/${id}`
		return this.request.delete(api, config)
	}

	massDelete = (ids: (string | number)[]): Promise<AxiosResponse<any>> => {
		const api = `${this.BASE_ENDPOINT}`
		const data = { ids }
		return this.request.delete(api, { data })
	}
}

export default BaseService
