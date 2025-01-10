import yup from '@helper/yup-valiator'
import { yupResolver } from '@hookform/resolvers/yup'

import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { FormEditProductProps } from '../components/DiscountForm'
import { ShopDiscountDto, shopDiscountService } from '@api/shopDiscountService'
import { useTranslation } from 'react-i18next'

export function useDiscountForm({ initData }: FormEditProductProps) {
	const { t } = useTranslation('discount')
	const schema = yup.object({
		code: yup
			.string()
			.matches(/^[A-Z0-9]+$/, t('msg.invalid_code'))
			.required(t('msg.required')),

		type: yup
			.string()
			.oneOf(['PERCENT', 'AMOUNT'], t('msg.invalid_value'))
			.required(t('msg.required')),

		value: yup
			.number()
			.typeError(t('msg.value_must_be_number'))
			.positive(t('msg.value_must_be_greater_than_0'))
			.required(t('msg.required')),

		min_order_value: yup
			.number()
			.typeError(t('msg.value_must_be_number'))
			.positive(t('msg.value_must_be_greater_than_0'))
			.required(t('msg.required')),

		max_discount_amount: yup
			.number()
			.typeError(t('msg.value_must_be_number'))
			.positive(t('msg.value_must_be_greater_than_0'))
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.when('type', (type: any, schema: any) =>
				type === 'PERCENT' ? schema.required(t('msg.required')) : schema.notRequired()
			),

		max_usage: yup
			.number()
			.typeError(t('msg.value_must_be_number'))
			.positive(t('msg.value_must_be_greater_than_0'))
			.required(t('msg.required'))
			.integer(t('msg.value_must_be_integer'))
			.required(t('msg.required')),

		valid_range: yup.object().shape({
			start: yup.date().typeError(t('msg.invalid_value')),
			end: yup.date().typeError(t('msg.invalid_value'))
		})
	})
	const methodForm = useForm<ShopDiscountDto>({
		mode: 'onTouched',
		resolver: yupResolver(schema),
		defaultValues: initData ?? {}
	})
	const router = useRouter()
	const onSubmit = methodForm.handleSubmit(async data => {
		console.log('🚀 ~ onSubmit ~ data:', data)
		try {
			const { valid_range, ...r } = data
			await shopDiscountService.save({
				...r,
				valid_from: valid_range.start?.toString(),
				valid_to: valid_range.end?.toString()
			})
			// console.log("🚀 ~ onSubmit ~ res:", res)
			toast.success('Saved')
			if (!data.id) {
				router.push('/shop/discount')
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			if (typeof e === 'object' && e !== null && 'message' in e) {
				const error = e as { message: string }
				toast.error(t(error?.message || 'An unexpected error occurred'))
			} else {
				toast.error('An unexpected error occurred')
			}
		}
	})

	return { methodForm, onSubmit }
}
