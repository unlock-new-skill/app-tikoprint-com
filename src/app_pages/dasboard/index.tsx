import { useTranslation } from 'react-i18next'
import OrderChart from './components/OrderChart'

export default function Dashboard() {
	const { t } = useTranslation('dashboard')
	return (
		<>
			<h1 className="font-normal">{t('title.activity_summary')}</h1>
			<OrderChart />
			<p className="text-center h-[30vh] leading-[30vh] underline">
				Our great features are coming soon !!!
			</p>
		</>
	)
}
