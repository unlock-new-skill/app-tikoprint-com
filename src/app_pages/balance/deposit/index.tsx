import { Divider } from '@nextui-org/react'
import { useTranslation } from 'react-i18next'
import AutoDeposit from './components/AutoDeposit'

export default function Deposit() {
	const { t } = useTranslation('balance')
	return (
		<div>
			<h1 className="font-normal text-[1.2rem]">{t('title.deposit')}</h1>
			<Divider />
			<div className="flex flex-col gap-4">
				<AutoDeposit />

				<Divider />
			</div>
		</div>
	)
}
