import lod from 'lodash'

export function getObjectValueByPath<ObjectDto>(
	path: string | string[],
	obj: ObjectDto
) {
	return lod.get(obj, path)
}

export function isNumericString(s: string): boolean {
	/**
	 * Kiểm tra một chuỗi chỉ chứa các ký tự số.
	 *
	 * @param s - Chuỗi cần kiểm tra.
	 * @returns True nếu chuỗi chỉ chứa số, ngược lại False.
	 */
	return /^[0-9]+$/.test(s)
}
