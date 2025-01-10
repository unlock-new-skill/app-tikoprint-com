import { useUserContext } from '@providers/UserProvider'

import clsx from 'clsx'

export default function AppHeader() {
	const { user } = useUserContext()

	// const { loading: loadingLogout, run: runLogout } = useRequest(
	// 	authService.logout,
	// 	{
	// 		manual: true,
	// 		retryCount: 1,
	// 		onFinally: () => {
	// 			handleLogout()
	// 		}
	// 	}
	// )

	return (
		<div
			className={clsx(
				'sticky transition-all duration-400 bg-primary-500 flex justify-between items-center h-[64px]  px-4',
				{
					// 'translate-y-0': user?.email,
					'translate-y-[0px]': !user?.email
				}
			)}
		>
			<div>LOGO</div>
			<div>User Bar</div>
		</div>
	)
}
