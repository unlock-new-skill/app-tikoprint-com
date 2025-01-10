import yup from '@helper/yup-valiator'
import { yupResolver } from '@hookform/resolvers/yup'

import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { FormEditProductProps } from '../components/PostForm'
import { ShopPostDto, shopPostService } from '@api/shopPostService'

const schema = yup.object().shape({
	title: yup.string().required('Required').min(10),
	thumnail_image: yup.string().required('Required'),
	description: yup.string().required('Required').min(50),
	content: yup
		.array()
		.of(
			yup.object().shape({
				title: yup.string().required(),
				content: yup.string().required()
			})
		)
		.required('Required'),
	seoTitle: yup.string().required('Required').min(10),
	seoDescription: yup.string().required('Required').min(10),
	seoKeywords: yup.string().required('Required').min(10),
	active: yup.boolean().required('Required')
})

export function useProductDetailForm({ initData }: FormEditProductProps) {
	const methodForm = useForm<ShopPostDto>({
		mode: 'onTouched',
		resolver: yupResolver(schema),
		defaultValues: initData ?? {
			content: [
				{
					title: '',
					content: ''
				}
			]
		}
	})
	const router = useRouter()
	const onSubmit = methodForm.handleSubmit(async data => {
		console.log('🚀 ~ onSubmit ~ data:', data)
		try {
			await shopPostService.save(data)
			// console.log("🚀 ~ onSubmit ~ res:", res)
			toast.success('Saved')
			if (!data.id) {
				router.push('/shop/post')
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			if (typeof e === 'object' && e !== null && 'message' in e) {
				const error = e as { message: string }
				toast.error(error.message || 'An unexpected error occurred')
			} else {
				toast.error('An unexpected error occurred')
			}
		}
	})

	return { methodForm, onSubmit }
}
