/* eslint-disable @typescript-eslint/no-explicit-any */
import { authService, LoginDto } from '@api/authService'
import { ApiException } from '@api/base/base-service.dto'
import { UserDto, userService } from '@api/userService'
import { useSafeState } from 'ahooks'
import { createContext, ReactNode, useCallback, useContext, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

interface Props {
	children: ReactNode
}

interface UserContextProps {
	user: UserDto | null
	handleLogin: (data: LoginDto) => Promise<void>
	handleLoginGoogle: (data: any) => Promise<void>
	handleLogout: () => void
	getPersonalInfo: () => Promise<void>
}
const UserContext = createContext({} as UserContextProps)
export function useUserContext() {
	return useContext(UserContext)
}

export default function UserProvider({ children }: Props) {
	const [user, setUser] = useSafeState<UserDto>({} as UserDto)
	// console.log('🚀 ~ UserProvider ~ user:', user)

	const navigate = useNavigate()
	const { pathname } = useLocation()
	// console.log('🚀 ~ UserProvider ~ pathname:', pathname)

	const getPersonalInfo = useCallback(async () => {
		try {
			const userRes = await userService.getPersonalInfo()
			const { data } = userRes
			if (data.data.status === 'WAIT_FOR_VERIFY') {
				navigate('/auth/confirm-email', {
					state: {
						email: data.data.email
					}
				})
				return
			}
			setUser(data.data)
		} catch (e: unknown) {
			if (e instanceof ApiException) {
				toast.error(e.message)
			} else {
				toast.error('An unexpected error occurred')
			}
		}
	}, [setUser])

	useEffect(() => {
		if (pathname !== '/' && !pathname?.includes('/auth')) {
			const localToken = localStorage.getItem('token')
			const expiredTime = localStorage.getItem('expired')
			const currentTime = Date.now()
			// console.log('🚀 ~ useEffect ~ currentTime:', currentTime)
			// console.log('🚀 ~ useEffect ~ currentTime:', Number(expiredTime))

			if (!localToken || !expiredTime || currentTime > Number(expiredTime)) {
				navigate('/auth/login')
			} else {
				getPersonalInfo()
			}
		}
	}, [pathname, navigate, getPersonalInfo])

	const handleLogin = useCallback(
		async (data: LoginDto) => {
			try {
				const resLogin = await authService.login(data)
				localStorage.setItem('token', resLogin.data.data.token)
				localStorage.setItem('expired', resLogin.data.data.exp.toString())
				toast.success('Login success')
				getPersonalInfo()
				if (pathname.includes('/auth')) {
					navigate('/dashboard')
				}
			} catch (e: unknown) {
				if (typeof e === 'object' && e !== null && 'message' in e) {
					const error = e as { message: string }
					toast.error(error.message || 'An unexpected error occurred')
				} else {
					toast.error('An unexpected error occurred')
				}
			}
		},
		[pathname, navigate, getPersonalInfo]
	)

	const handleLoginGoogle = useCallback(
		async (data: any) => {
			try {
				const resLogin = await authService.loginGoogle(data)
				localStorage.setItem('token', resLogin.data.data.token)
				localStorage.setItem('expired', resLogin.data.data.exp.toString())
				toast.success(data?.message ?? 'Login Success')
				getPersonalInfo()
				if (pathname.includes('/auth')) {
					navigate('/dashboard')
				}
			} catch (e: any) {
				toast.error(e?.message ?? 'Server error')
			}
		},
		[pathname, navigate, getPersonalInfo]
	)

	const handleLogout = useCallback(async () => {
		try {
			await userService.getPersonalInfo()
			window.localStorage.removeItem('token')
			window.localStorage.removeItem('expired')
			window.sessionStorage.clear()
			navigate('/auth/login')
		} catch (e: unknown) {
			if (e instanceof ApiException) {
				toast.error(e.message)
			} else {
				toast.error('An unexpected error occurred')
			}
		}
	}, [navigate])

	const context: UserContextProps = {
		user,
		handleLogin,
		handleLogout,
		getPersonalInfo,
		handleLoginGoogle
	}

	return <UserContext.Provider value={context}>{children}</UserContext.Provider>
}
