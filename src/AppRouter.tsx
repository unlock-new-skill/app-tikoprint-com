import { Navigate, Route, Routes } from 'react-router-dom'

import React, { lazy, Suspense } from 'react'
import { CircularProgress } from '@nextui-org/react'

const LazyLogin = lazy(() => import('@app_pages/auth/login'))
const LazyRegister = lazy(() => import('@app_pages/auth/register'))
const LazyConfirmCode = lazy(() => import('@app_pages/auth/confirm_email'))
const LazyForgotPassword = lazy(() => import('@app_pages/auth/forgot-password'))

const LazyDashboard = lazy(() => import('@app_pages/dasboard'))
const LazyDeposit = lazy(() => import('@app_pages/balance/deposit'))
const LazyPrintAndShip = lazy(() => import('@app_pages/print-and-ship/list-page'))
const LazyPrintAndShipNewOrder = lazy(() => import('@app_pages/print-and-ship/detail-page'))
const LazyBalance = lazy(() => import('@app_pages/balance/balance'))
const LazyTicket = lazy(() => import('@app_pages/ticket/listpage'))
const LazyTicketDetail = lazy(() => import('@app_pages/ticket/detailpage'))

const pages = [
	{
		path: '/',
		element: <Navigate to={'/dashboard'} />
	},
	{
		path: '/auth/login',
		element: <LazyLogin />
	},
	{
		path: '/auth/confirm-email',
		element: <LazyConfirmCode />
	},
	{
		path: '/auth/forgot-password',
		element: <LazyForgotPassword />
	},
	{
		path: '/dashboard',
		element: <LazyDashboard />
	},
	{
		path: '/auth/register',
		element: <LazyRegister />
	},

	{
		path: '/print-and-ship',
		element: <LazyPrintAndShip />
	},
	{
		path: '/print-and-ship/new-order',
		element: <LazyPrintAndShipNewOrder />
	},
	{ path: '/balance', element: <LazyBalance /> },
	{ path: '/balance/deposit', element: <LazyDeposit /> },
	{ path: '/ticket', element: <LazyTicket /> },
	{ path: '/ticket/:id', element: <LazyTicketDetail /> },

	{
		path: '*',
		element: <>NOT FOUND PAGE</>
	}
]
// 1
export default function AppRouter() {
	//   const { user, isLoading } = useUserContext();

	//   const protectPage = (role, page) => {
	//     if (!role) {
	//       return page;
	//     } else {
	//       if (isLoading) {
	//         return (
	//           <div className="w-screen fixed z-[999] h-screen flex items-center justify-center">
	//             <Loading className="w-[60px]" />
	//           </div>
	//         );
	//       } else {
	//         if (role === "*" || user?.role?.includes(role)) {
	//           return page;
	//         } else {
	//           return <Lazy403 />;
	//         }
	//       }
	//     }
	//   };
	return (
		<Suspense
			fallback={
				<div className="flex w-full h-screen items-center justify-center">
					<CircularProgress className="w-[42px]" />
				</div>
			}
		>
			<Routes>
				{pages.map(i => (
					<Route key={i.path} path={i.path} element={i.element} />
				))}
			</Routes>
		</Suspense>
	)
}
