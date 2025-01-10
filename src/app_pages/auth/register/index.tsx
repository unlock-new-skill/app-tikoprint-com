import { MdEmail } from 'react-icons/md'
import { BaseInput } from '@components/data-input'
import { useRegisterForm } from './hooks/useRegisterForm'
import { RiLockPasswordFill } from 'react-icons/ri'
import { RiLockPasswordLine } from 'react-icons/ri'
import { Button } from '@nextui-org/react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Register() {
	const {
		methodForm: {
			control,
			formState: { isSubmitting, isDirty }
		},
		onSubmit
	} = useRegisterForm()
	const { t } = useTranslation('auth')

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 ">
			<div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-pink-400 to bg-primary-400">
				<p className="font-bold text-[1.8rem] my-8 text-white">Tikoprint E-commerce</p>
				<form
					onSubmit={onSubmit}
					className="flex flex-col gap-2 md:gap-3 p-4 border shadow-md rounded-md bg-white"
				>
					<h1 className="font-normal text-primary-500">
						{t('title.register_new_account')}
					</h1>
					<BaseInput
						control={control}
						name="email"
						label="Email"
						isRequired
						startContent={<MdEmail className="text-primary-500" />}
					/>
					<div className="grid grid-cols-2 gap-2">
						<BaseInput
							control={control}
							name="first_name"
							label={t('label.first_name')}
							isRequired
						/>
						<BaseInput
							control={control}
							name="last_name"
							label={t('label.last_name')}
							isRequired
						/>
					</div>
					<BaseInput
						type="password"
						control={control}
						name="password"
						label={t('label.password')}
						placeholder={t('placeholder.password')}
						isRequired
						startContent={<RiLockPasswordLine className="text-primary-500" />}
					/>
					<BaseInput
						type="password"
						control={control}
						name="confirm_password"
						label={t('label.confirm_password')}
						placeholder={t('placeholder.confirm_password')}
						isRequired
						startContent={<RiLockPasswordFill className="text-primary-500" />}
					/>
					<Button
						aria-label="button"
						type="submit"
						color="primary"
						size="lg"
						isLoading={isSubmitting}
						disabled={!isDirty}
					>
						{t('button.register')}
					</Button>
					<p className="text-center text-[0.8rem] ">
						{t('label.already_have_an_account')}
					</p>
					<Link to={'/auth/login'}>
						<Button aria-label="button" className="w-full" size="sm">
							{t('button.login')}
						</Button>
					</Link>
				</form>
			</div>
			<div>Slider</div>
		</div>
	)
}
