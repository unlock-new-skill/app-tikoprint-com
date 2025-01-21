// import { MdEmail } from 'react-icons/md'
import { BaseInput } from '@components/data-input'
import { useLoginForm } from './hooks/useLoginForm'
// import { RiLockPasswordLine } from 'react-icons/ri'
import { Button, Image } from '@nextui-org/react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GoogleLogin } from '@react-oauth/google'
import { toast } from 'react-toastify'
import { useUserContext } from '@providers/UserProvider'
import { ChangeLanguage } from '@layout/SidebarMenu'

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
		<div
			style={{
				background:
					'linear-gradient(to right bottom, #ffffff, #dad7fb, #afb2f6, #7a8ff2, #006fee)'
			}}
		>
			<div className="grid grid-cols-1 lg:grid-cols-2 mx-auto max-w-[1200px]">
				<div className="flex items-center justify-center">
					<div className="max-w-[500px] relative w-full">
						<div className="z-[1]   absolute w-2/3 max-w-[240px] aspect-[4/5] left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%]">
							<Image
								src="/images/shirt_1.png"
								alt="1"
								className="drop-shadow-common-1 animate-move-2"
							/>
						</div>
						<div className="z-[0]   absolute w-2/3 max-w-[200px] aspect-[4/5] left-[50%]  top-[50%] translate-y-[-50%] rotate-[30deg]">
							<Image
								src="/images/shirt_2.png"
								alt="1"
								className="drop-shadow-common-2 animate-move-1"
							/>
						</div>
						<div className="z-[0]  absolute w-2/3 max-w-[200px] aspect-[4/5] right-[50%]  top-[50%] translate-y-[-50%] rotate-[-30deg]">
							<Image
								src="/images/shirt_3.png"
								alt="1"
								className="drop-shadow-common-2 animate-move-3"
							/>
						</div>
					</div>
				</div>
				<div className="flex flex-col justify-center items-center h-screen ">
					{/* <p className="font-bold text-[1.8rem] my-8 text-orange-600">
						Tikoprint Fulfillment
					</p> */}

					<form
						onSubmit={onSubmit}
						className="flex flex-col gap-2 md:gap-3 p-4 border shadow-md rounded-md bg-white md:min-w-[400px]"
					>
						<div>
							<GoogleLogin
								onSuccess={handleLoginGoogle}
								onError={() => {
									toast.error('Đã có lỗi nảy ra')
								}}
							/>
						</div>
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
						<p className="text-center text-[0.8rem] ">{t('label.or')}</p>
						<div className="flex gap-3 items-center justify-between">
							<Link to={'/auth/register'}>
								<Button
									aria-label="button"
									className="w-full"
									size="sm"
									variant="flat"
									color="primary"
								>
									{t('button.create_new_account')}
								</Button>
							</Link>
							<Link to={'/auth/forgot-password'}>
								<Button
									aria-label="button"
									className="w-full"
									size="sm"
									variant="flat"
									color="primary"
								>
									{t('button.forgot_password')}
								</Button>
							</Link>
						</div>
					</form>
					<div className="my-2">
						<ChangeLanguage />
					</div>
				</div>
			</div>
		</div>
	)
}
