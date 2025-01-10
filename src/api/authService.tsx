import BaseService from '@api/base/BaseService'
import { ApiDataRes } from './base/base-service.dto'

export interface LoginDto {
	email: string
	password: string
}

interface LoginResDto {
	token: string
	exp: number
}

export interface RegisterAccountDto extends LoginDto {
	first_name: string
	last_name: string
	confirm_password: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class AuthService extends BaseService<any, any> {
	register = (data: RegisterAccountDto) => {
		return this.request.post<null>('/api/auth/seller/register', data)
	}

	login = (data: LoginDto) => {
		return this.request.post<ApiDataRes<LoginResDto>>('/api/auth/seller/login', data)
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	loginGoogle = (data: any) => {
		return this.request.post<ApiDataRes<LoginResDto>>('/api/auth/seller/login-google', data)
	}
}

export const authService = new AuthService()
