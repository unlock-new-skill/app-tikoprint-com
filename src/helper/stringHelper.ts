/* eslint-disable @typescript-eslint/no-explicit-any */
// import { BE_URL } from '../../env'
export function removeVietnameseTones(str: string) {
	str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
	str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
	str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
	str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
	str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
	str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
	str = str.replace(/đ/g, 'd')
	str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
	str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
	str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
	str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
	str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
	str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y')
	str = str.replace(/Đ/g, 'D')
	// Some system encode vietnamese combining accent as individual utf-8 characters
	// Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
	str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '') // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
	str = str.replace(/\u02C6|\u0306|\u031B/g, '') // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
	// Remove extra spaces
	// Bỏ các khoảng trắng liền nhau
	str = str.replace(/ + /g, ' ')
	str = str.trim()
	// Remove punctuations
	// Bỏ dấu câu, kí tự đặc biệt
	str = str.replace(
		/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
		' '
	)
	return str
}

// export const findColor = (selectedAttributes, categoryAttributes) => {
// 	const colorAttribute = attributesMemo?.find(i =>
// 		i?.name?.toLowerCase()?.includes('color')
// 	)
// 	if (!colorAttribute) {
// 		return 'transparent'
// 	}
// 	const result = Object.keys(selectedAttributes).reduce((r, k) => {
// 		if (k === colorAttribute?.id) {
// 			const selectedOptionId = selectedAttributes[k]
// 			return colorAttribute?.attributeOptions?.find(
// 				i => i?.id === selectedOptionId
// 			)?.customValue?.color_code
// 		}
// 		return r
// 	}, 'transparent')

// 	return result
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const compareJSONObjects = (
	jsonStr: string,
	jsonObj: { [key: string]: any }
) => {
	// Chuyển đổi jsonStr từ string thành object
	const parsedJson = JSON.parse(jsonStr)

	// Lấy các key của hai object
	const keys1 = Object.keys(parsedJson)
	const keys2 = Object.keys(jsonObj)

	// So sánh số lượng key của hai object
	if (keys1.length !== keys2.length) {
		return false
	}

	// So sánh các key và value của hai object
	for (const key of keys1) {
		if (parsedJson[key] !== jsonObj[key]) {
			return false
		}
	}

	return true
}

// export const getUrlBase64 = url => {
// 	const splitUrl = url.split('/')
// 	const fileName = splitUrl[splitUrl.length - 1]
// 	const bucket = splitUrl[splitUrl.length - 2]
// 	return `${BE_URL}/api/file/image-b64/${bucket}/${fileName}`
// }
// export const getUrlBase64 = url => {
// 	const splitBaseUrl = url?.split('https://')

// 	const splitBucket = splitBaseUrl[1].split('.')
// 	const splitUrl = url.split('/')
// 	const fileName = splitUrl[splitUrl.length - 1]

// 	return `${BE_URL}/api/file/fetch-buffer?url=${url}`
// }

// export const getB64Download = url => {
// 	const [_, fileName] = url?.split('https://rapid-design.rapidprinttee.com/')
// 	return `${BE_URL}/api/file/image-b64/rapid-design/${fileName}`
// }

// export function chunkArray(array, chunkSize) {
// 	const chunks = []
// 	for (let i = 0; i < array.length; i += chunkSize) {
// 		chunks.push(array.slice(i, i + chunkSize))
// 	}
// 	return chunks
// }

// export function sortAttributeOptions(i) {
// 	const cloneOptions = i?.attributeOptions
// 	let result = []

// 	const commonSizeList = [
// 		'XS',
// 		'S',
// 		'M',
// 		'L',
// 		'XL',
// 		'2XL',
// 		'3XL',
// 		'4XL',
// 		'5XL'
// 	]

// 	if (i?.name?.toLowerCase().includes('size')) {
// 		const commonSize = i?.attributeOptions?.filter(o =>
// 			commonSizeList.includes(o.value)
// 		)
// 		const notCommon = i?.attributeOptions?.filter(
// 			o => !commonSizeList.includes(o.value)
// 		)
// 		const sortCommon = commonSizeList
// 			.map(s => {
// 				const existed = commonSize?.find(
// 					o => o?.value?.toLowerCase() === s.toLowerCase()
// 				)
// 				return existed
// 			})
// 			.filter(i => i)
// 		result = [...sortCommon, ...notCommon]
// 	} else {
// 		cloneOptions.sort((a, b) => a.value.localeCompare(b.value))
// 		result = cloneOptions
// 	}
// 	return result
// }

export function isValidUSPostalCode(postalCode?: string) {
	if (!postalCode) {
		return false
	}
	const zipCodeRegex = /^\d{5}(-\d{4})?$/
	return zipCodeRegex.test(postalCode)
}
