import { statisticService } from '@api/statisticService'
import { useRequest } from 'ahooks'

import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Filler,
	Legend,
	LinearScale,
	Title,
	Tooltip
} from 'chart.js'
import { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'

import { useTranslation } from 'react-i18next'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Filler, Legend)

const options = {
	maintainAspectRatio: false,
	responsive: true,
	// scales: {
	// 	x: {
	// 		display: true,
	// 		stacked: true
	// 	},
	// 	y: {
	// 		display: true,
	// 		stacked: true
	// 	}
	// },
	plugins: {
		legend: {
			display: true
		},
		tooltip: {
			enabled: true
		}
	}
}

const OrderChart = () => {
	const { data: resData } = useRequest(statisticService.getPODOrderStatistic)
	console.log('🚀 ~ OrderChart ~ resData:', resData)
	const { t } = useTranslation('dashboard')

	const data = useMemo(() => {
		if (resData?.data?.data) {
			const order = resData?.data?.data

			return {
				labels: order?.chart?.map(i => i.month),
				datasets: [
					{
						label: t('label.order'),
						data: order?.chart?.map(i => i.count ?? 0),

						borderWidth: 2,
						pointRadius: 0,
						tension: 0.4,
						borderColor: 'rgb(37, 222, 65)',
						backgroundColor: ctx => {
							const gradient = ctx.chart.ctx.createLinearGradient(
								0,
								0,
								0,
								ctx.chart.height
							)
							gradient.addColorStop(0, 'rgb(37, 222, 65)') // Màu bắt đầu
							gradient.addColorStop(1, '#c9edd8') // Màu kết thúc
							return gradient
						},
						fill: true
					},
					{
						label: t('label.total_paid'),
						data: order?.chart?.map(i => i.total ?? 0),

						borderWidth: 2,
						pointRadius: 0,
						tension: 0.4,
						borderColor: 'rgb(98, 164, 249)',
						backgroundColor: ctx => {
							const gradient = ctx.chart.ctx.createLinearGradient(
								0,
								0,
								0,
								ctx.chart.height
							)
							gradient.addColorStop(0, '#006fee') // Màu bắt đầu
							gradient.addColorStop(1, '#c2ddf2') // Màu kết thúc
							return gradient
						},
						fill: true
					}
				]
			}
		}
		return {
			labels: [],
			datasets: []
		}
	}, [JSON.stringify(resData)])

	return (
		<div className="h-[400px]">
			<Bar data={data} options={options} />
		</div>
	)
}

export default OrderChart
