/* eslint-disable @typescript-eslint/no-explicit-any */
import { authService } from '@api/authService'
import { BaseOTPInput } from '@components/data-input'
import yup from '@helper/yup-valiator'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@nextui-org/react'
import { useUserContext } from '@providers/UserProvider'
import { useCountDown, useRequest } from 'ahooks'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function ConfirmEmail() {
	const [targetDate, setTargetDate] = useState(0)
	const { getPersonalInfo } = useUserContext()
	const navigate = useNavigate()
	const { t } = useTranslation('auth')
	const { state } = useLocation()
	// console.log('🚀 ~ useVerificationModal ~ pathname:', pathname)
	const [countdown] = useCountDown({
		targetDate
	})
	// console.log('🚀 ~ Register ~ countdown:', countdown)
	const { run: requestSendMail, loading: loadingSent } = useRequest(authService.getVerifyMail, {
		manual: true,
		onSuccess: data => {
			setTargetDate(new Date().getTime() + 80000)
			toast.success(data?.data.message)
		},
		onError: e => {
			toast.error(e?.message)
		}
	})

	useEffect(() => {
		if (state?.email) {
			requestSendMail({ email: state?.email })
		}
	}, [state?.email])

	const { control, handleSubmit } = useForm({
		resolver: yupResolver(
			yup.object().shape({
				code: yup.string().min(6).required()
			})
		)
	})

	const onSubmit = handleSubmit(async data => {
		try {
			await authService.verifyCode({ email: state?.email, code: data.code })
			getPersonalInfo()
			navigate('/dashboard')
		} catch (e: any) {
			toast.error(e?.message)
		}
	})

	return (
		<div className="w-screen h-screen flex items-center justify-center bg-gray-200">
			<form
				onSubmit={onSubmit}
				className="flex flex-col gap-2 p-4 rounded-md shadow-md bg-white"
			>
				<p>{t('title.confirm_your_email')}</p>
				<BaseOTPInput
					control={control}
					label={t('label.enter_code_has_been_sent', {
						email: state?.email
					})}
					length={6}
					isRequired
					name="code"
				/>
				<div className="grid grid-cols-2 gap-2">
					<Button
						isLoading={loadingSent}
						isDisabled={countdown !== 0}
						onPress={() => requestSendMail({ email: state?.email })}
						type="button"
					>
						{countdown === 0 ? t('button.resend') : `${Math.round(countdown / 1000)}s`}
					</Button>
					<Button color="primary" type="submit">
						{t('button.submit')}
					</Button>
				</div>
			</form>
		</div>
	)
}
