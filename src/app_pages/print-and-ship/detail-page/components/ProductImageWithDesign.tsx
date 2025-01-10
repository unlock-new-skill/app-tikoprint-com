/* eslint-disable @next/next/no-img-element */
import { AvaiableProductModelImage } from '@api/fulfillmentService'
// import { Button } from '@nextui-org/react'
import clsx from 'clsx'
// import JSZip from 'jszip'
// import { saveAs } from 'file-saver'

interface ProductImageWithDesignPropsDto {
	color: string
	data: AvaiableProductModelImage
	containerClassName?: string
	boxWidth?: number
	getBase64?: boolean
	showDownload?: boolean
	renderCompress: boolean
}
const ProductImageWithDesign = (props: ProductImageWithDesignPropsDto) => {
	const {
		color,
		data,
		containerClassName = '',
		boxWidth = 120
		// getBase64 = false,
		// showDownload = false,

		// renderCompress = false
	} = props
	if (data?.config?.every(cf => !cf.design_url)) {
		return null
	}
	// if (data?.id === 'fake-mockup' && !data?.config[0]?.design_url) {
	// 	return null
	// }

	// const handleDownloadImage = async () => {
	// 	const blobs = await Promise.all(
	// 		data?.config?.map(async (cf, i) => {
	// 			if (cf?.design_url) {
	// 				const response = await fetch(
	// 					cf?.design_url?.startsWith('https://rapid')
	// 						? getB64Download(cf?.design_url)
	// 						: cf?.design_url
	// 				)
	// 				const blob = await response.blob()
	// 				const fileName = `${orderId}_${data?.name}-${i + 1}.png`
	// 				return {
	// 					fileName,
	// 					blob
	// 				}
	// 			}
	// 			return null
	// 		})
	// 	)

	// 	blobs
	// 		.filter(i => i)
	// 		.forEach(({ fileName, blob }) => {
	// 			saveAs(blob, fileName)
	// 		})
	// }

	// const totalDesign = data?.config?.reduce((r, i) => {
	// 	if (i?.design_url) {
	// 		return r + 1
	// 	}
	// 	return r
	// }, 0)

	return (
		<div className="flex flex-col gap-2">
			<div className="flex gap-2 items-center">
				<p className="font-[500]">{data?.name}</p>
				{/* {showDownload && totalDesign > 0 && (
					<Button
						aria-label='button'
						size="sm"
						color="primary"
						
						onClick={}
					>
						Download
					</Button>
				)} */}
			</div>

			<div
				style={{
					width: boxWidth
				}}
				className={clsx(
					'relative ',
					containerClassName ?? ' aspect-[4/5] border box-content'
				)}
			>
				{data?.image ? (
					<img
						style={{ backgroundColor: color ?? 'transparent' }}
						src={data.image}
						alt="mock"
						className="w-full h-full"
						// crossOrigin="anonymous"
					/>
				) : null}

				{data?.config?.map(cf_design => {
					// const frameSize = {
					// 	width: (boxWidth * cf_design?.width) / 100,
					// 	height: (boxWidth * 1.25 * cf_design?.height) / 100
					// }
					if (!cf_design?.design_url) {
						return null
					}

					// const [designWidth] = cf_design?.design_size?.width?.split('px')
					// const [designHeight] = cf_design?.design_size?.height?.split('px')

					// const convertDesignWidth = (designWidth / 600) * boxWidth
					// const convertDesignHeight = (designHeight / (600 * 1.25)) * (boxWidth * 1.25)

					// const convertPositionX = cf_design?.design_position?.x * (boxWidth / 600)
					// const convertPositionY = cf_design?.design_position?.y * (boxWidth / 600)

					return (
						<div
							key={`frame-${cf_design?.design_url}`}
							style={{
								width: `${cf_design?.width ?? 100}%`,
								height: `${cf_design?.height ?? 100}%`,
								top: cf_design?.top
									? `${cf_design.top}%`
									: 'auto',
								left: cf_design?.left
									? `${cf_design.left}%`
									: 'auto'
							}}
							className="absolute"
						>
							<img
								src={cf_design?.compress_design_url}
								// style={{
								// 	width: convertDesignWidth,
								// 	height: convertDesignHeight,
								// 	transform: `translateX(${convertPositionX}px) translateY(${convertPositionY}px)`
								// }}
								className="w-full h-full"
								alt="Seller design"
							/>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default ProductImageWithDesign
