import { Button, CircularProgress, Divider } from '@nextui-org/react'
import { useParams } from 'next/navigation'
import { useRequest } from 'ahooks'

import { Link } from 'react-router-dom'
import PostForm from './components/DiscountForm'
import { useEffect } from 'react'
import { shopDiscountService } from '@api/shopDiscountService'
import { useTranslation } from 'react-i18next'
import DiscountForm from './components/DiscountForm'
// import { ShopTagDto } from '@api/shopCatalogTagService'

export default function DiscountDetail() {
	const p = useParams()
	const { run, data, loading } = useRequest(shopDiscountService.find, {
		manual: true
	})
	useEffect(() => {
		if (p?.id && p?.id !== 'new') {
			run(p?.id as string)
		}
	}, [p, run])

	// const initFormData: ShopPostDto | null = data?.data?.data
	// 	? {
	// 			id: data?.data?.data?.id,
	// 			title: data?.data?.data?.title,
	// 			description: data?.data?.data?.description,
	// 			content: data?.data?.data?.content,
	// 			active: data?.data?.data?.active,
	// 			seoDescription: data?.data?.data?.seoDescription,
	// 			seoKeywords: data?.data?.data?.seoKeywords,
	// 			seoTitle: data?.data?.data?.seoTitle,
	// 			thumnail_image: data?.data?.data?.thumnail_image,
	// 			cover_image: data?.data?.data?.cover_image
	// 	  }
	// 	: null

	const { t } = useTranslation('discount')

	const isEdit = p?.id !== 'new'

	return (
		<>
			<div className="flex  justify-between items-center">
				<h3 className="font-[400]">
					{isEdit ? t('title.edit_discount_code') : t('title.create_discount_code')}
				</h3>
				<Link to={'/shop/post'}>
					<Button aria-label="button" color="primary" size="sm" variant="bordered">
						{t('button.go_back')}
					</Button>
				</Link>
			</div>
			<Divider className="my-2" />
			{loading ? (
				<div className="h-[50vh] flex justify-center items-center">
					<CircularProgress />
				</div>
			) : (
				<DiscountForm initData={null} />
			)}
		</>
	)
}
