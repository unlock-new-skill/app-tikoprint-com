// import { useLocalStorage } from '@hooks/useLocalStorage'
// import { useUserContext } from './UserProvider'
// import { useState } from 'react'
// import { Button, Divider, Modal } from 'antd'
// import { useSessionStorage } from '@hooks/useSessionStorage'

// export default function NotificationProvider({ children }) {
// 	const { user } = useUserContext()

// 	const [seen, setSeen] = useSessionStorage('lastest_notifi', '0')

// 	const [open, setOpen] = useState(true)

// 	return (
// 		<>
// 			{children}
// 			{seen === '0' && user?.id && (
// 				<Modal footer={null} closable={false} open={open}>
// 					<div className="flex flex-col gap-2">
// 						<div className="flex justify-center items-center gap-3">
// 							<img
// 								alt="1"
// 								src="/images/maintain_time.png"
// 								width={40}
// 							/>
// 							<p className="text-[1.2rem] font-semibold">
// 								System maintenance scheduled
// 							</p>
// 						</div>
// 						<p>
// 							Rapidprinttee would like to inform our customers
// 							about the scheduled system maintenance and upgrade:
// 						</p>
// 						<ol>
// 							<li className="text-red-500">
// 								* 6AM - 8AM Vietnam time on November 7
// 							</li>
// 							<li className="text-red-500">
// 								* 5PM-7PM US (UTC-6) on November 6
// 							</li>
// 						</ol>
// 						<p>Thank you very much!</p>
// 						<Divider />

// 						<Button
// aria-label='button'
// 							block
// 							type="primary"
// 							onClick={() => {
// 								setSeen('1')
// 								setOpen(false)
// 							}}
// 						>
// 							OK
// 						</Button>
// 					</div>
// 				</Modal>
// 			)}
// 		</>
// 	)
// }

export default function NotificationProvider() {
	//hi
}
