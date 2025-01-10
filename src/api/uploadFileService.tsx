import BaseService from '@api/base/BaseService'
import { toast } from 'react-toastify'
import { ApiDataRes } from './base/base-service.dto'

export interface UploadImageResDto {
	url: string
}

export function validateImage(image: File) {
	const { size, name } = image
	const extNames = name.split('.')
	const ext = extNames.pop()
	if (!ext || !['jpg', 'jpeg', 'png'].includes(ext)) {
		toast.error('Only Accept: ' + ['jpg', 'jpeg', 'png'].toString())
		return false
	}
	if (size > 3.5 * 1024 * 1024) {
		toast.error('Image to large, < 5MB')
		return false
	}
	return true
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
class UploadFile extends BaseService<any, any> {
	uploadCommonImage = (image: File) => {
		const acceptAble = validateImage(image)
		if (!acceptAble) {
			return null
		}
		const formData = new FormData()
		formData.append('image', image)
		return this.request.post<ApiDataRes<UploadImageResDto>>(
			'/api/seller/file/common-image',
			formData
		)
	}

	uploadProductImage = (image: File) => {
		const acceptAble = validateImage(image)
		if (!acceptAble) {
			return null
		}
		const formData = new FormData()
		formData.append('image', image)
		return this.request.post<ApiDataRes<UploadImageResDto>>(
			'/api/seller/file/product-image',
			formData
		)
	}

	uploadProductVideo = (file: File) => {
		const formData = new FormData()
		formData.append('video', file)
		return this.request.post<ApiDataRes<UploadImageResDto>>(
			'/api/seller/file/product-video',
			formData
		)
	}

	uploadFulfillmentDesign = (data: FormData) => {
		return this.request.post<ApiDataRes<{ original: string; compressed: string }>>(
			'/api/seller/file/fulfillment-design',
			data
		)
	}

	uploadPdf = (data: FormData) => {
		return this.request.post<ApiDataRes<UploadImageResDto>>(
			'/api/seller/file/shipping-label',
			data
		)
	}
}

export const uploadFileService = new UploadFile()
