/* eslint-disable no-unsafe-optional-chaining */
import { useOrderDetailContext } from '../OrderDetailProvider'
import { Image } from '@nextui-org/react'
import { AvaiableProductDto } from '@api/fulfillmentService'
interface ProductCardDto {
	data: AvaiableProductDto
	handleOpenCustomImageModal: (a: AvaiableProductDto) => void
}
export const ProductCard = (props: ProductCardDto) => {
	const { data, handleOpenCustomImageModal } = props
	const {
		// id,
		name,
		avatar,
		subTitle,
		// productAttributes,
		productClassifications
	} = props?.data

	const priceRange = productClassifications?.reduce(
		(result, i) => {
			const newMin = i?.price < result?.min ? i?.price : result?.min
			const newMax = i?.price > result?.max ? i?.price : result?.max
			return {
				min: newMin,
				max: newMax
			}
		},
		{
			min: productClassifications[0]?.price ?? 0,
			max: 0
		}
	)

	return (
		// <Badge.Ribbon text={category_name}>
		<div
			onClick={() => handleOpenCustomImageModal(data)}
			className="group   relative flex flex-col gap-[2px] shadow-common-box cursor-pointer  rounded-2xl transition-all duration-300  overflow-hidden "
		>
			<div className="w-full aspect-[4/5] overflow-hidden ">
				<Image className="w-full h-full " loading="lazy" src={avatar} alt={name} />
			</div>
			{/* <div className="flex flex-col gap-2 mt-[4px]  ">
				{productAttributes?.map(ca_att => {
					const att = ca_att?.attribute
					const maxItems = 5
					return (
						<div
							key={att?.id}
							className="flex flex-wrap gap-[2px] px-2 "
						>
							{att?.attributeOptions
								?.slice(0, maxItems)
								.map(option => (
									<div
										style={{
											backgroundColor: att?.name
												?.toLowerCase()
												?.includes('color')
												? option?.customValue
														?.color_code
												: 'transparent'
										}}
										key={option?.id}
										className={clsx(
											'border p-[2px] rounded-md font-[600]',
											{
												'w-[24px] h-[24px] text-transparent':
													att?.name
														?.toLowerCase()
														?.includes('color')
											}
										)}
									>
										{!att?.name
											?.toLowerCase()
											?.includes('color')
											? option?.value
											: 'xx'}
									</div>
								))}
							{att?.attributeOptions?.length > maxItems && (
								<div className="border p-[2px] rounded-md font-[600]">
									+{att.attributeOptions.length - maxItems}
								</div>
							)}
						</div>
					)
				})}
			</div> */}

			<div className="flex flex-col gap-1 px-2 mb-2 mt-2">
				<p className="text-blue-500 font-bold text-[1rem] text-center">{name}</p>
				<p className=" text-[0.8rem] h-[2rem] text-center">{subTitle}</p>
				<p className="px-2 my-1 font-[400] text-[1.1rem] text-blue-500 text-center rounded-md border">
					{priceRange?.min === priceRange?.max
						? priceRange.min
						: `${priceRange?.min} - ${priceRange?.max}`}
					$
				</p>
			</div>
			{/* <Button
						aria-label='button'
				className="opacity-0 top-[25%] left-[50%] translate-x-[-50%] group-hover:scale-[1.05] group-hover:opacity-[1] absolute transition-all duration-200 z-[1] "
				type="primary"
			>
				+ Add this Product
			</Button> */}
		</div>
		// </Badge.Ribbon>
	)
}

const ProductGrid = ({
	handleOpenCustomImageModal
}: {
	handleOpenCustomImageModal: (a: AvaiableProductDto) => void
}) => {
	const { loadingProduct, products } = useOrderDetailContext()

	return (
		<div className="w-full grid grid-cols-2  gap-4 md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-7   p-4 rounded-md ">
			{loadingProduct
				? Array(6)
						.fill('_')
						.map((i, key) => (
							<div
								key={`loading-${key}`}
								className="flex flex-col gap-2 border shadow-2xl rounded-md  p-1"
							>
								<div className="w-full aspect-[4/5] bg-slate-300 animate-pulse ">
									{' '}
								</div>
								<div className="w-full h-[40px] bg-gray-400 animate-pulse rounded-md shadow-xl">
									{' '}
								</div>
							</div>
						))
				: products?.map(i => (
						<ProductCard
							key={i?.id}
							handleOpenCustomImageModal={handleOpenCustomImageModal}
							data={i}
						/>
				  ))}
		</div>
	)
}

export default ProductGrid
