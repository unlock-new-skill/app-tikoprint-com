import {
	createContext,
	ReactNode,
	// Suspense,
	useContext,
	useEffect
} from 'react'
import { ToastContainer } from 'react-toastify'
// import { PagesProgressBar as ProgressBar } from 'next-nprogress-bar'
const AppContext = createContext({})
import AOS from 'aos'
import AppLayout from '@layout/Layout'
import UserProvider from './UserProvider'
import { NextUIProvider } from '@nextui-org/react'
// import { useLocalStorage } from '@hooks/useLocalStorage'
export const useAppContext = () => useContext(AppContext)
import Web3Provider from './Web3Provider'
import { useTranslation } from 'react-i18next'
import { GoogleOAuthProvider } from '@react-oauth/google'
import SocketProvider from './SocketProvider'
// import { Inbox } from '@novu/react'
// import { useNavigate } from 'react-router-dom'
interface Props {
	children: ReactNode
}

export default function AppProvider({ children }: Props) {
	useEffect(() => {
		AOS.init()
	}, [])

	const {
		i18n: { changeLanguage, language }
	} = useTranslation()
	// const navigate = useNavigate()
	// const [lng, setLng] = useLocalStorage('lng', 'vi', 'string')

	// useEffect(() => {
	console.log('🚀 ~ AppProvider ~ changeLanguage:', changeLanguage)
	console.log('🚀 ~ AppProvider ~ language:', language)
	// 	console.log('🚀 ~ AppProvider ~ lng:', lng)
	// 	if (['vi', 'en'].includes(lng)) {
	// 		changeLanguage(lng)
	// 	}
	// }, [lng])
	return (
		<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
			<NextUIProvider>
				<Web3Provider>
					<AppContext.Provider value={{}}>
						<UserProvider>
							<SocketProvider>
								<AppLayout>
									{/* <Suspense
								fallback={
									<div className="flex justify-center items-center h-[80vh]">
										<CircularProgress />
									</div>
								}
							> */}
									{children}
									{/* </Suspense> */}
								</AppLayout>
								{/* <Inbox
								applicationIdentifier="JIKDRHRxg2yO"
								subscriberId="67891f52122783d14d6ace5e"
								routerPush={(path: string) => navigate(path)}
								appearance={{
									variables: {
										colorPrimary: '#DD2450',
										colorForeground: '#0E121B'
									}
								}}
							/> */}
							</SocketProvider>
						</UserProvider>
						<ToastContainer
							position="top-center"
							autoClose={5000}
							hideProgressBar={false}
							newestOnTop={true}
							closeOnClick
							pauseOnFocusLoss
							draggable
							pauseOnHover
						/>
					</AppContext.Provider>
				</Web3Provider>
			</NextUIProvider>
		</GoogleOAuthProvider>
	)
}
