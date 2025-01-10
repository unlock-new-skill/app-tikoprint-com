import { useShopConfigContext } from '@app_pages/shop-config/ShopConfigProvider'
import { Button } from '@nextui-org/react'
import clsx from 'clsx'
import { useState } from 'react'
import { FaDesktop, FaMobile, FaTablet } from 'react-icons/fa'

export default function WebFrame() {
	const [className, setClassName] = useState('w-full')
	const { template } = useShopConfigContext()
	console.log('🚀 ~ WebFrame ~ template:', template)

	const viewOptions = [
		{
			icon: <FaDesktop />,
			v: 'w-full min-h-[90vh]'
		},
		{
			icon: <FaTablet />,
			v: 'w-[680px] min-h-[90vh]'
		},
		{
			icon: <FaMobile />,
			v: 'max-w-[425px] min-h-[900px]'
		}
	]
	return (
		<div className="flex-1  rounded-md overflow-hidden">
			<div className="flex gap-2 items-center my-1 p-2">
				<p>Device</p>
				{viewOptions.map(i => (
					<Button
						aria-label="button"
						key={i.v}
						size="sm"
						isIconOnly
						color={i.v === className ? 'primary' : 'default'}
						onPress={() => setClassName(i.v)}
					>
						{i.icon}
					</Button>
				))}
			</div>

			<iframe
				className={clsx('border-2 rounded-md', className)}
				src={'http://localhost:3333'}
				title="Preview Your Shop"
			/>
		</div>
	)
}
