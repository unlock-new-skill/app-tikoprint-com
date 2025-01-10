import { SaveShopProductDto, shopProductService } from '@api/shopProductService'
import yup from '@helper/yup-valiator'
import { yupResolver } from '@hookform/resolvers/yup'

import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { FormEditProductProps } from '../components/ProductForm'
const schema = yup.object().shape({
	name: yup.string().required('Required').min(10),
	description: yup.string().required('Required').min(50),
	collectionId: yup.string().required('Required'),
	tags: yup.array(),
	images: yup
		.array()
		.of(
			yup.object().shape({
				id: yup.string(),
				url: yup.string().nullable()
			})
		)
		.required('Required'),
	isActive: yup.boolean().required('Required')
})

export function useProductDetailForm({ initData }: FormEditProductProps) {
	const methodForm = useForm<SaveShopProductDto>({
		mode: 'onTouched',
		resolver: yupResolver(schema),
		defaultValues: initData ?? { isActive: true, tags: [] }
	})
	const router = useRouter()
	const onSubmit = methodForm.handleSubmit(async data => {
		try {
			const remapPayload = { ...data, images: data.images.filter(i => i.url).map(i => i.url) }
			// console.log("🚀 ~ onSubmit ~ remapPayload:", remapPayload)
			const res = await shopProductService.save(remapPayload)
			// console.log("🚀 ~ onSubmit ~ res:", res)
			toast.success('Saved')
			if (!data.id) {
				router.replace(`/shop/product/${res.data.data.id}`)
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
