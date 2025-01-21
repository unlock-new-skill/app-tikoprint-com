import { Card, CardBody, Image } from '@nextui-org/react'
import { useTranslation } from 'react-i18next'
import { useCoinbaseFormModal } from '../hooks/useCoinbaseFormModal'
import { usePaypalFormModal } from '../hooks/usePaypalFormModal'
import { useBankFormModal } from '../hooks/useBankFormModal'

export default function AutoDeposit() {
	const { t } = useTranslation('balance')
	const { handleOpenModalForm, renderModalform } = useCoinbaseFormModal()
	const { handleOpenModalFormPaypal, renderModalformPaypal } = usePaypalFormModal()
	const { handleOpenModalFormBank, renderModalformBank } = useBankFormModal()

	const items = [
		{
			text: t('title.deposit_using_usdc_with_coinbase_gateway'),
			image: 'https://diplo-media.s3.eu-central-1.amazonaws.com/2023/08/Coinbase-480x320%401.5x-1.jpg',
			onclick: handleOpenModalForm
		},
		{
			text: t('title.deposit_using_paypal'),
			image: 'https://i.pcmag.com/imagery/reviews/068BjcjwBw0snwHIq0KNo5m-15.fit_lim.size_1050x591.v1602794215.png',
			onclick: handleOpenModalFormPaypal
		},
		{
			text: t('title.deposit_using_banking') + ' (25.800vnd = 1$)',
			image: 'https://taichinhvisa.vn/wp-content/uploads/2024/04/tao-ma-qr-tren-viet-qr.jpeg',
			onclick: handleOpenModalFormBank
		}
	]
	return (
		<div className="py-4">
			<h2 className="font-[400] mb-4">{t('title.auto_deposit')}</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-8 gap-2">
				{items.map((i, index) => (
					<div onClick={i.onclick} key={index}>
						<Card className="hover:bg-foreground-200 cursor-pointer">
							<CardBody>
								<Image
									alt="deposit"
									src={i.image}
									className="aspect-video border"
								/>
								<p className=" text-center line-clamp-2 min-h-[4rem] text-[1rem] py-2 ">
									{i.text}
								</p>
							</CardBody>
						</Card>
					</div>
				))}
			</div>
			{renderModalform()}
			{renderModalformPaypal()}
			{renderModalformBank()}
		</div>
	)
}
