import { LoginDto } from '@api/authService'
import yup from '@helper/yup-valiator'
import { yupResolver } from '@hookform/resolvers/yup'
import { useUserContext } from '@providers/UserProvider'
import { useForm } from 'react-hook-form'
const schema = yup.object().shape({
	email: yup.string().required().email('Email invalid'),

	password: yup.string().required().min(6)
})

export function useLoginForm() {
	const { handleLogin } = useUserContext()

	const methodForm = useForm<LoginDto>({
		mode: 'onTouched',
		resolver: yupResolver(schema)
	})

	const onSubmit = methodForm.handleSubmit(async data => {
		await handleLogin(data)
	})

	return { methodForm, onSubmit }
}
