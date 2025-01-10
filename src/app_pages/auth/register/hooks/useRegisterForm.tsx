import { authService, RegisterAccountDto } from '@api/authService'
import yup from '@helper/yup-valiator'
import { yupResolver } from '@hookform/resolvers/yup'

import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
const schema = yup.object().shape({
	email: yup.string().required().email('Email invalid'),
	first_name: yup.string().required(),
	last_name: yup.string().required(),
	password: yup.string().required().min(6),
	confirm_password: yup
		.string()
		.required()
		.oneOf([yup.ref('password')], 'Password not match')
})

export function useRegisterForm() {
	const navigate = useNavigate()

	const methodForm = useForm<RegisterAccountDto>({
		mode: 'onTouched',
		resolver: yupResolver(schema)
	})

	const onSubmit = methodForm.handleSubmit(async data => {
		try {
			await authService.register(data)
			toast.success('Create account success')
			navigate(`/auth/login`)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			toast.error(error?.message ?? 'An unexpected error occurred')
		}
	})

	return { methodForm, onSubmit }
}
