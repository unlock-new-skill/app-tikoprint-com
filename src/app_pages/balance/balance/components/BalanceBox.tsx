import { Button } from '@nextui-org/react'
import { useUserContext } from '@providers/UserProvider'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function Balancebox() {
	const { user } = useUserContext()
	const { t } = useTranslation('balance')
	return (
		<div className="flex flex-col gap-2 rounded-md border p-4 shadow-md h-full min-w-[200px]">
			<p className="font-normal text-[1.4rem] text-center">{t('title.balance')}</p>
			<p className="font-bold text-[2rem] text-center">{user?.balance} $</p>
			<Link to={'/balance/deposit'}>
				{' '}
				<Button color="primary" fullWidth>
					+ {t('label.deposit')}
				</Button>
			</Link>
		</div>
	)
}
