import { useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initValue: T, type: 'string' | 'number' | 'any') {
	const [state, setState] = useState<T | null>(null) // State can be null initially
	const [isClient, setIsClient] = useState(false)

	// Only set localStorage on the client side
	useEffect(() => {
		setIsClient(true)
	}, [])

	useEffect(() => {
		if (!isClient) return

		const existed = window.localStorage.getItem(key)

		if (!existed || existed === 'undefined' || existed === 'null') {
			window.localStorage.setItem(
				key,
				typeof initValue === 'string' ? initValue : JSON.stringify(initValue)
			)
			setState(initValue)
		} else {
			setState(
				type === 'number'
					? Number(existed)
					: existed.startsWith('{') || existed.startsWith('[')
					? JSON.parse(existed)
					: existed
			)
		}
	}, [isClient, key, initValue, type])

	useEffect(() => {
		if (isClient) {
			window.localStorage.setItem(
				key,

				JSON.stringify(state)
			)
		}
	}, [state, key, isClient])

	return [state, setState]
}
