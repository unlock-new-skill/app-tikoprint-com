/* eslint-disable @typescript-eslint/no-explicit-any */
// import { authService } from '@api/auth/authService'
// import { useUserContext } from '@providers/UserProvider'
import { useCountDown, useRequest } from 'ahooks'

import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { authService } from '@api/authService'
import { toast } from 'react-toastify'
import { BaseInput, BaseOTPInput } from '@components/data-input'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import yup from '@helper/yup-valiator'
import { useTranslation } from 'react-i18next'
import { Button } from '@nextui-org/react'
const ForgotPassword = () => {
	const navigate = useNavigate()
	const [targetDate, setTargetDate] = useState(0)

	const [countdown] = useCountDown({
		targetDate
	})
	const { t } = useTranslation('auth')

	const { control, handleSubmit, watch } = useForm({
		resolver: yupResolver(
			yup.object().shape({
				email: yup.string().min(6).email().required(),
				code: yup.string().min(6).required(),
				password: yup.string().min(6).required()
			})
		)
	})

	const { run: requestSendMail, loading: loadingSent } = useRequest(
		authService.getForgotPasswordMail,
		{
			manual: true,
			// retryCount: 2,
			onSuccess: data => {
				setTargetDate(new Date().getTime() + 180000)
				toast.success(data.data?.message)
			},
			onError: e => {
				toast.error(e?.message)
			}
		}
	)

	const email = watch('email')
	// console.log('🚀 ~ ForgotPassword ~ email:', email)

	const handleSendMail = () => {
		requestSendMail({ email })
	}

	const disabledSentBtn =
		!email ||
		email?.trim()?.length === 0 ||
		!email.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		)

	const onSubmit = handleSubmit(async data => {
		try {
			await authService.confirmResetPassword(data)
			navigate('/auth/login')
		} catch (e: any) {
			toast.error(e?.message)
		}
	})

	return (
		<div className="w-screen h-screen flex items-center justify-center bg-gray-200">
			<div className="rounded-md drop-shadow-md border  shadow-xl p-4 mt-[20vh] h-max bg-white">
				<form onSubmit={onSubmit} className="flex gap-2 flex-col 2xl:min-w-[340px]">
					<div className="flex justify-center my-2">
						<img src="/icon.png" className="max-w-[44px]" />
					</div>
					<h1 className="text-center font-normal">{t('title.reset_password')}</h1>
					<BaseInput control={control} name="email" label="Email" isRequired />
					<BaseInput
						control={control}
						name="password"
						label={t('label.password')}
						isRequired
					/>
					<div className="flex gap-2 items-center">
						<BaseOTPInput
							control={control}
							label={'Code'}
							length={6}
							isRequired
							name="code"
						/>
						<Button
							isLoading={loadingSent}
							isDisabled={countdown !== 0 || disabledSentBtn}
							onPress={handleSendMail}
							type="button"
							size="sm"
							className="self-center mt-6"
						>
							{countdown === 0
								? t('button.send')
								: `${Math.round(countdown / 1000)}s`}
						</Button>
					</div>

					<Button type="submit" color="primary">
						{t('button.submit')}
					</Button>
				</form>
				<div className="flex justify-center items-center gap-4 mt-4">
					<span className="font-[600]">Or</span>
					<Link to="/auth/login">
						<Button size="sm" variant="flat" color="primary" className="font-[600]">
							{t('button.login')}
						</Button>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default ForgotPassword
