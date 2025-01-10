/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios, { AxiosResponse } from 'axios'
import { pickBy } from 'lodash'
import Qs from 'qs'
import { ApiErrorRes } from './base-service.dto'
// import { toast } from 'react-toastify'
export const createInstance = (baseUrl = '', middleware: any) => {
	const options = {
		baseURL: baseUrl,
		timeout: 60000,
		headers: {
			'X-Requested-With': 'XMLHttpRequest'
		},
		// withCredentials: true,
		paramsSerializer(params: any) {
			params = pickBy(params, val => {
				return val !== null && val !== '' && val !== 'undefined'
			})
			return Qs.stringify(params)
		}
	}

	const instance = Axios.create(options)

	instance.interceptors.request.use(
		async (requestConfig: any) => {
			await Promise.all(middleware(requestConfig))
			return requestConfig
		},
		requestError => {
			// console.log(requestError)
			return Promise.reject(requestError)
		}
	)

	// Add a response interceptor
	instance.interceptors.response.use(
		response => {
			const { data } = response
			if (data.error || data?.code !== 0) {
				return Promise.reject<ApiErrorRes>(data)
			}
			return response as any
		},
		error => {
			if (error?.response?.status === 401) {
				//lam gi do di
				console.log('WHAT THER F', error)
				if (typeof window !== 'undefined') {
					window.localStorage.clear()
					window.sessionStorage.clear()
					window.location.reload()
				}
			}

			return Promise.reject<ApiErrorRes>(error?.response?.data)
		}
	)
	return instance
}
