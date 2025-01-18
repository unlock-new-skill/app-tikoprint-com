import { ReactNode, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useUserContext } from './UserProvider'
import { toast } from 'react-toastify'
import { useDebounceFn } from 'ahooks'

const URL = import.meta.env.VITE_BE_URL
const socket = io(URL, {
	extraHeaders: {
		token: window.localStorage.getItem('token') ?? ''
	}
})

export interface SSEDto {
	message: string
	action: string | null
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	payload: any
}

export default function SocketProvider({ children }: { children: ReactNode }) {
	const { user, getPersonalInfo } = useUserContext()
	console.log('🚀 ~ SocketProvider ~ user:', user)
	const [isConnected, setIsConnected] = useState(socket.connected)
	console.log('🚀 ~ SocketProvider ~ isConnected:', isConnected)
	// const [fooEvents, setFooEvents] = useState([])

	const { run: debounceAction } = useDebounceFn(
		(value: SSEDto) => {
			toast.success(value.message)
			if (value?.action && value?.action === 'REFRESH_BALANCE') {
				getPersonalInfo()
			}
		},
		{ wait: 600 }
	)
	useEffect(() => {
		if (user?.email) {
			function onConnect() {
				setIsConnected(true)
			}

			function onDisconnect() {
				setIsConnected(false)
			}

			function onSEE(value: SSEDto) {
				debounceAction(value)
			}

			socket.on('connect', onConnect)
			socket.on('disconnect', onDisconnect)
			socket.on('sse', onSEE)

			return () => {
				socket.off('connect', onConnect)
				socket.off('disconnect', onDisconnect)
				// socket.off('foo', onFooEvent)
			}
		}
	}, [user])
	return children
}
