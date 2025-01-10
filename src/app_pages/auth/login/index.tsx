// import { MdEmail } from 'react-icons/md'
import { BaseInput } from '@components/data-input'
import { useLoginForm } from './hooks/useLoginForm'
// import { RiLockPasswordLine } from 'react-icons/ri'
import { Button } from '@nextui-org/react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GoogleLogin } from '@react-oauth/google'
import { toast } from 'react-toastify'
import { useUserContext } from '@providers/UserProvider'

export default function Login() {
	const { handleLoginGoogle } = useUserContext()
	const {
		methodForm: {
			control,
			formState: { isSubmitting, isDirty }
		},
		onSubmit
	} = useLoginForm()
	// console.log('🚀 ~ Register ~ isSubmitting:', isSubmitting)
	const { t } = useTranslation('auth')
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 ">
			<div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-pink-400 to bg-primary-400">
				<p className="font-bold text-[1.8rem] my-8 text-white">Tikoprint E-commerce</p>
				<div>
					<GoogleLogin
						onSuccess={handleLoginGoogle}
						onError={() => {
							toast.error('Đã có lỗi nảy ra')
						}}
					/>
				</div>
				<form
					onSubmit={onSubmit}
					className="flex flex-col gap-2 md:gap-3 p-4 border shadow-md rounded-md bg-white md:min-w-[400px]"
				>
					<h1 className="font-normal text-primary-500">{t('title.login')}</h1>
					<BaseInput
						control={control}
						name="email"
						label="Email"
						isRequired
						// startContent={<MdEmail className="text-primary-500" />}
					/>

					<BaseInput
						type="password"
						control={control}
						name="password"
						label={t('label.password')}
						isRequired
						// startContent={
						// 	<RiLockPasswordLine className="text-primary-500" />
						// }
					/>
					<Button
						aria-label="button"
						type="submit"
						color="primary"
						size="lg"
						isLoading={isSubmitting}
						disabled={!isDirty}
					>
						{!isSubmitting && t('button.login')}
					</Button>
					<div className="flex gap-3 items-center justify-between">
						<p className="text-center text-[0.8rem] ">{t('label.or')}</p>
						<Link to={'/auth/register'}>
							<Button aria-label="button" className="w-full" size="sm">
								{t('button.create_new_account')}
							</Button>
						</Link>
					</div>
				</form>
			</div>
			<div>Slider</div>
		</div>
	)
}
