import { userService } from '@api/userService'
import { useRequest } from 'ahooks'

import {
	CategoryScale,
	Chart as ChartJS,
	Filler,
	Legend,
	LineElement,
	LinearScale,
	PointElement,
	Title,
	Tooltip
} from 'chart.js'
import { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Filler,
	Legend
)

const options = {
	maintainAspectRatio: false,
	responsive: true,
	scales: {
		x: {
			display: true
		},
		y: {
			display: true
		}
	},
	plugins: {
		legend: {
			display: true
		},
		tooltip: {
			enabled: true
		}
	}
}

const MoneyChart = () => {
	const { data: resData } = useRequest(userService.getMoneyStatistic, {
		defaultParams: [
			{
				year: '2025'
			}
		]
	})
	const { t } = useTranslation('balance')
	const data = useMemo(() => {
		if (resData?.data?.data) {
			const statistic = resData?.data?.data
			console.log('🚀 ~ data ~ statistic:', statistic)

			return {
				labels: statistic?.chart?.map(i => i.month),
				datasets: [
					{
						label: t('label.top_up'),
						data: statistic?.chart?.map(i => i.deposited._sum?.amount ?? 0),

						borderWidth: 2,
						pointRadius: 0,
						tension: 0.4,
						borderColor: 'rgb(203, 156, 247)'
						// backgroundColor: ctx => {
						// 	const gradient = ctx.chart.ctx.createLinearGradient(
						// 		0,
						// 		0,
						// 		0,
						// 		ctx.chart.height
						// 	)
						// 	gradient.addColorStop(0, '#e48cf8') // Màu bắt đầu
						// 	gradient.addColorStop(1, '#6d288f') // Màu kết thúc
						// 	return gradient
						// },
						// fill: true
					},
					{
						label: t('label.payment'),
						data: statistic?.chart?.map(i => i.payment._sum?.amount ?? 0),

						borderWidth: 2,
						pointRadius: 0,
						tension: 0.4,
						borderColor: 'rgb(98, 164, 249)'
						// backgroundColor: ctx => {
						// 	const gradient = ctx.chart.ctx.createLinearGradient(
						// 		0,
						// 		0,
						// 		0,
						// 		ctx.chart.height
						// 	)
						// 	gradient.addColorStop(0, '#1995e8') // Màu bắt đầu
						// 	gradient.addColorStop(1, '#2449f0') // Màu kết thúc
						// 	return gradient
						// },
						// fill: true
					},
					{
						label: t('label.withdraw'),
						data: statistic?.chart?.map(i => i.withdraw._sum?.amount ?? 0),

						borderWidth: 2,
						pointRadius: 0,
						tension: 0.4,
						borderColor: 'rgb(253, 144, 72)'
						// backgroundColor: ctx => {
						// 	const gradient = ctx.chart.ctx.createLinearGradient(
						// 		0,
						// 		0,
						// 		0,
						// 		ctx.chart.height
						// 	)
						// 	gradient.addColorStop(0, '#ff871d') // Màu bắt đầu
						// 	gradient.addColorStop(1, '#f65252') // Màu kết thúc
						// 	return gradient
						// },
						// fill: true
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
		<div className="flex-1 border px-4 rounded-md shadow-md">
			{/* <div className="flex gap-4 justify-between items-center">
				<div className="flex ">
					<div className="flex  gap-4 items-center">
						<span>Total: </span>
						<span className="font-[700] text-[20px] text-purple-500">
							{loading ? (
								<CircularProgress />
							) : (
								resData?.data?.data?.totalDeposited?._sum?.amount.toLocaleString()
							)}
						</span>
					</div>
				</div>
			</div>
			<div
			// className={clsx('flex justify-center', {
			// 	'animate-pulse bg-gray-200': !data
			// })}
			> */}
			<Line data={data} options={options} width={'100%'} height={'260px'} />
			{/* </div> */}
		</div>
	)
}

export default MoneyChart
