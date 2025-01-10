import { calculatePriceItem } from '@helper/orderHelper'
import { Chip } from '@nextui-org/react'
import { useTranslation } from 'react-i18next'

interface Props {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any
}
export default function Bill({ data }: Props) {
	// console.log('🚀 ~ Bill ~ data:', data)
	const {
		// can_create_order,
		// can_transport,
		// express_ship,
		// total,
		total_bill,
		items_calculated
	} = calculatePriceItem(data)
	console.log('🚀 ~ Bill ~ calculatePriceItem(data):', calculatePriceItem(data))
	const { t } = useTranslation('fulfillment')
	return (
		<div className="">
			<p className="font-normal text-primary-500 py-2">
				{t('label.total')}: {`${total_bill ?? 0}$`}
			</p>
			<div className="grid grid-cols-1 divide-y bg-foreground-100 text-[0.7rem] justify-center max-h-[260px] overflow-y-scroll">
				<div className="grid grid-cols-5 sticky top-0  bg-foreground-200 z-[6]  divide-x [&>*]:p-1 border-b">
					<p className="text-center">{t('table.column.no_')}</p>

					<p>{t('label.Base')}</p>
					<p>{t('label.Print')}</p>
					<p>{t('label.handling_and_shipping')}</p>

					<p>{t('table.column.sub_total')}</p>
				</div>

				{items_calculated?.map((i, index) => (
					<div key={index} className="items-center grid grid-cols-5 divide-x [&>*]:p-1 ">
						<div className="flex justify-center">
							<Chip
								size="sm"
								variant="bordered"
								color="secondary"
								className="text-[0.8rem] font-normal"
							>
								{index + 1}
							</Chip>
						</div>
						<p>{i?.base_price_text}</p>
						<p>{i?.printFee?.totalFee}</p>
						<p>{i?.sh_fee_text}</p>
						<p>{i?.total_text}</p>
					</div>
				))}
			</div>
		</div>
	)
}
