import { BaseInput, BaseSelect, BaseSwitch } from '@components/data-input'
import BaseRadioButton from '@components/data-input/BaseRadioButton'
// import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import UploadLabel from './UploadLabel'
import Items from './Items'
import { Button } from '@nextui-org/react'
import Bill from './Bill'
import useOrderForm from '../hooks/useOrderForm'
import { Link } from 'react-router-dom'
import states from 'us-state-converter'
import { useUpdateEffect } from 'ahooks'

export default function OrderForm() {
	const {
		methodForm: {
			watch,
			control,
			setValue,
			formState: { isDirty, isSubmitting, errors }
		},
		onSubmit,
		renderSuccessModal
	} = useOrderForm()
	console.log('🚀 ~ OrderForm ~ errors:', errors)
	const { t } = useTranslation('fulfillment')
	const print_only = watch('print_only')
	const use_url_pdf = watch('shipping.use_url')

	useUpdateEffect(() => {
		// console.log(print_only)
		if (!print_only) {
			setValue('shipping', {
				first_name: '',
				last_name: '',
				express_shipping: false,
				address_1: '',
				address_2: '',
				zip_code: undefined,
				city: undefined,
				state: undefined,
				country: 'US'
			})
		} else {
			setValue('shipping', {
				first_name: '',
				last_name: '',
				carrier: 'USPS',
				label_url: '',
				use_url: false,
				tracking_code: undefined
			})
		}
	}, [print_only, setValue])
	// console.log('🚀 ~ OrderForm ~ print_only:', print_only)
	return (
		<>
			<form className="flex gap-4 " onSubmit={onSubmit}>
				<div className="xl:w-[440px]  flex flex-col gap-2 ">
					<div className="flex gap-2 items-center">
						<Link to={'/print-and-ship'}>
							<Button size="sm" color="primary">
								{t('button.back')}
							</Button>
						</Link>

						<p className="font-[400] text-[1.1rem]">{t('title.create_new_order')}</p>
					</div>

					<BaseInput
						name="seller_order_id"
						control={control}
						label={t('label.seller_order_id')}
						placeholder={t('placeholder.seller_order_id')}
						isRequired={false}
					/>
					<BaseRadioButton
						name="print_only"
						control={control}
						label={t('label.print_service')}
						placeholder={t('placeholder.print_service')}
						isRequired
						options={[
							{
								value: true,
								label: '',
								description: (
									<div className="flex flex-col ">
										<p className="font-normal">{t('label.print_only')}</p>
										<p className=" text-[0.7rem]">
											{t('label.print_only_description')}
										</p>
									</div>
								)
							},
							{
								value: false,
								label: '',
								description: (
									<div className="flex flex-col ">
										<p className="font-normal">{t('label.print_and_ship')}</p>
										<p className=" text-[0.7rem]">
											{t('label.print_and_ship_description')}
										</p>
									</div>
								)
							}
						]}
					/>

					<div className="grid grid-cols-2 gap-2">
						<BaseInput
							name="shipping.first_name"
							control={control}
							label={t('label.first_name')}
							placeholder={t('placeholder.first_name')}
							isRequired
						/>
						<BaseInput
							name="shipping.last_name"
							control={control}
							label={t('label.last_name')}
							placeholder={t('placeholder.last_name')}
							isRequired
						/>
					</div>

					{print_only ? (
						<>
							<BaseSelect
								name="shipping.carrier"
								control={control}
								label={t('label.carrier')}
								placeholder={t('placeholder.carrier')}
								isRequired
								options={['USPS'].map(i => ({
									key: i,
									label: i,
									value: i
								}))}
							/>
							<BaseInput
								name="shipping.tracking_code"
								control={control}
								label={t('label.tracking_code')}
								placeholder={t('placeholder.tracking_code')}
								isRequired
							/>
							<BaseSwitch
								name="shipping.use_url"
								control={control}
								label={t('label.use_label_url')}
								placeholder={t('placeholder.use_label_url')}
								isRequired
							/>
							{use_url_pdf ? (
								<BaseInput
									name="shipping.label_url"
									control={control}
									label={t('label.shipment_label')}
									placeholder={t('placeholder.shipment_label')}
									isRequired
								/>
							) : (
								<UploadLabel
									control={control}
									label={t('label.shipment_label')}
									name="shipping.label_url"
									isRequired
								/>
							)}
						</>
					) : (
						<>
							<BaseInput
								name="shipping.address_1"
								control={control}
								label={t('label.address_1')}
								placeholder={t('placeholder.address_1')}
								isRequired
							/>
							<BaseInput
								name="shipping.address_2"
								control={control}
								label={t('label.address_2')}
								placeholder={t('placeholder.address_2')}
								isRequired={false}
							/>
							<div className="grid grid-cols-2 gap-2">
								<BaseInput
									name="shipping.zip_code"
									control={control}
									label={t('label.zip_code')}
									placeholder={t('placeholder.zip_code')}
									isRequired
								/>
								<BaseInput
									name="shipping.city"
									control={control}
									label={t('label.city')}
									placeholder={t('placeholder.city')}
									isRequired
								/>
								<BaseSelect
									name="shipping.state"
									control={control}
									label={t('label.state')}
									placeholder={t('placeholder.state')}
									isRequired
									options={states().map(i => ({
										key: JSON.stringify(i),
										value: i.usps,
										label: `${i?.usps} - ${i?.name}`
									}))}
								/>
								<BaseSelect
									name="shipping.express_shipping"
									control={control}
									label={t('label.priority_shipping')}
									isRequired
									isClearable
									isMultiline={false}
									options={[
										{
											label: t('label.default'),
											value: false
										},
										{
											label: t('label.express_shipping') + ' +6.5$',
											value: true
										}
									]}
								/>
							</div>
						</>
					)}
					<Button
						aria-label="button"
						type="submit"
						color="primary"
						size="lg"
						isDisabled={!isDirty}
						isLoading={isSubmitting}
					>
						{!isSubmitting && t('button.create_new_order')}
					</Button>

					<Bill data={watch()} />
				</div>

				<div className="flex-1">
					<Items control={control} />
					{errors?.items?.message && (
						<p className="text-danger-400">{errors?.items?.message}</p>
					)}
				</div>
			</form>
			{renderSuccessModal()}
		</>
	)
}
