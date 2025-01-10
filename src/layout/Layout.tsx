// import AppHeader from './AppHeader'
import { useLocation } from 'react-router-dom'
import SideBarMenu from './SidebarMenu'
import { createContext, useContext, useState } from 'react'

interface LayoutContextProps {
	collapsed: boolean
	toggleCollapseSidebar: () => void
	minimizeSidebar: () => void
}
const LayoutContext = createContext<LayoutContextProps>({} as LayoutContextProps)
export function useLayoutContext() {
	return useContext(LayoutContext)
}

export default function AppLayout({ children }) {
	const [collapsed, setCollapsed] = useState(false)
	const toggleCollapseSidebar = () => setCollapsed(p => !p)

	const minimizeSidebar = () => {
		if (!collapsed) {
			setCollapsed(true)
		}
	}
	const { pathname } = useLocation()

	if (pathname === '/' || pathname?.includes('/auth')) {
		return children
	}

	return (
		<LayoutContext.Provider value={{ collapsed, toggleCollapseSidebar, minimizeSidebar }}>
			<div className="flex h-screen">
				<SideBarMenu />

				<div className="p-4 flex-1 h-full overflow-y-scroll bg-foreground-200 drop-shadow-xl">
					<div className="bg-white  p-2 rounded-md shadow-sm">{children}</div>
				</div>
			</div>
		</LayoutContext.Provider>
	)
}
