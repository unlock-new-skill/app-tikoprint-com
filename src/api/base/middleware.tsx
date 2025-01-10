/* eslint-disable @typescript-eslint/no-explicit-any */
const authToken = async (requestConfig: { [key: string]: any }) => {
	// console.log('🚀 ~ authToken ~ requestConfig:', requestConfig)

	const localToken = localStorage.getItem('token')

	//   const authToken = getAuthTokenSession();
	// const { url, notAuth } = requestConfig
	// if (excludeAuthenApi.includes(url) || notAuth) {
	// 	return requestConfig
	// }

	requestConfig.headers[`token`] = localToken
	requestConfig.headers['Accept-Language'] = localStorage.getItem('i18nextLng') ?? 'vi'
	//   const language = getDataSession(LOCAL_STORAGE, "lng");
	//   if (language) {
	//     requestConfig.headers.language = language;
	//   }

	return requestConfig
}

const setWithCredentials = (requestConfig: any) => {
	// const { url } = requestConfig
	// console.log('🚀 ~ setWithCredentials ~ url:', url)
	// if (
	// 	[
	// 		'/api/auth/refresh',
	// 		'/api/auth/login',
	// 		'/api/user/logout',
	// 		'/api/user/my-devices'
	// 	].includes(url)
	// ) {
	// requestConfig.withCredentials = true
	// } else {
	requestConfig.withCredentials = false
	// }
	return requestConfig
}

export const globalApiMiddleware = {
	auth: authToken,
	setWithCredentials
}
