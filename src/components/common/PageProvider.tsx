import { createContext, useContext, ReactNode, FC } from 'react'

export function createPageContext<T>() {
	const PageContext = createContext<T>({} as T)

	const usePageContext = (): T => {
		const context = useContext(PageContext)
		if (!context) {
			throw new Error('usePageContext must be used within a PageProvider')
		}
		return context
	}

	const PageProvider: FC<{ value: T; children: ReactNode }> = ({
		value,
		children
	}) => {
		return (
			<PageContext.Provider value={value}>
				{children}
			</PageContext.Provider>
		)
	}

	return { PageProvider, usePageContext }
}
