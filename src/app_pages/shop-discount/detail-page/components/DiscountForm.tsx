import {
	BaseDateTimeRangePickerPropsDto,
	BaseInput,
	BaseInputNumber,
	BaseSelect
} from '@components/data-input'
import { useDiscountForm } from '../hooks/useDiscountForm'

import { Button } from '@nextui-org/react'

import { ShopPostDto } from '@api/shopPostService'
import { useTranslation } from 'react-i18next'
// import { ShopTagDto } from '@api/shopCatalogTagService'
import { FaPercentage } from 'react-icons/fa'
import { RiMoneyDollarCircleFill } from 'react-icons/ri'
export interface FormEditProductProps {
	initData: ShopPostDto | null
}
export default function DiscountForm({ initData }: FormEditProductProps) {
	const {
		methodForm: {
			control,
			watch,
			formState: { isDirty, isSubmitting }
		},
		onSubmit
	} = useDiscountForm({ initData })

	const type = watch('type')
	console.log('🚀 ~ DiscountForm ~ type:', type)

	const { t } = useTranslation('discount')

	return (
		<div className="flex w-full gap-4 max-w-[400px]">
			<form onSubmit={onSubmit} className="grid gap-2 xl:gap-2 grid-cols-1 2xl:w-[900px]">
				<BaseInput
					control={control}
					name="code"
					label={t('label.discount_code')}
					isRequired
					placeholder={t('placeholder.discount_code')}
				/>

				<BaseSelect
					control={control}
					name="type"
					label={t('label.discount_type')}
					placeholder={t('label.discount_type')}
					options={[
						{ label: t('label.PERCENT'), value: 'PERCENT' },
						{ label: t('label.AMOUNT'), value: 'AMOUNT' }
					]}
					isRequired
				/>

				<BaseInputNumber
					control={control}
					name="value"
					label={t('label.discount_value')}
					isRequired
					placeholder={t('placeholder.discount_value')}
					endContent={
						type === 'PERCENT' ? (
							<FaPercentage className="text-primary-500" />
						) : (
							<RiMoneyDollarCircleFill className="text-success-500" />
						)
					}
				/>

				<BaseInputNumber
					control={control}
					name="min_order_value"
					label={t('label.min_order_value')}
					isRequired
					placeholder={t('placeholder.min_order_value')}
					startContent={<RiMoneyDollarCircleFill className="text-warning-500" />}
				/>
				<BaseInputNumber
					control={control}
					name="max_discount_amount"
					label={t('label.max_discount_amount')}
					isRequired
					placeholder={t('placeholder.max_discount_amount')}
					startContent={<RiMoneyDollarCircleFill className="text-warning-500" />}
				/>

				<BaseInputNumber
					control={control}
					name="max_usage"
					label={t('label.max_usage')}
					isRequired
					placeholder={t('placeholder.max_usage')}
				/>
				<BaseDateTimeRangePickerPropsDto
					control={control}
					name="valid_range"
					label={t('label.valid_time') + ' (US - Los Angeles)'}
					isRequired
					placeholder={t('placeholder.valid_time')}
					timezone="America/Los_Angeles"
				/>

				<Button
					aria-label="button"
					type="submit"
					color="primary"
					isDisabled={!isDirty}
					isLoading={isSubmitting}
				>
					{t('button.save')}
				</Button>
			</form>
			<div className="flex-1">
				<div className="sticky top-[64px] shadow-md p-2"></div>
			</div>
		</div>
	)
}
