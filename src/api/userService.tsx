import BaseService from '@api/base/BaseService'
import { ApiDataRes } from './base/base-service.dto'

export interface UserDto {
	email: string
	first_name: string
	last_name: string
	balance: number
	createdAt: string
	status: 'WAIT_FOR_VERIFY' | 'ACTIVE'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class UserService extends BaseService<any, any> {
	getPersonalInfo = () => {
		return this.request.get<ApiDataRes<UserDto>>('/api/seller/account/me')
	}

	getMoneyStatistic = (params: { year: string }) => {
		return this.request.get<ApiDataRes<any>>('/api/seller/account/statistic/money', { params })
	}
}

export const userService = new UserService()
