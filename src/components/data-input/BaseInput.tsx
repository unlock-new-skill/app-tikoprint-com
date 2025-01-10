import { useController } from 'react-hook-form'
import { BaseInputPropDto } from './data-input.dto'
import { Input } from '@nextui-org/input'

export default function BaseInput(props: BaseInputPropDto) {
	const {
		color = 'default',
		type = 'text',
		labelPlacement = 'inside',
		variant = 'flat',
		size = 'sm',
		...restProps
	} = props

	const {
		field: { onChange, ref, value },
		fieldState: { error }
	} = useController({
		name: props.name,
		control: props.control
	})
	// console.log('🚀 ~ BaseInput ~ error:', error)

	return (
		<Input
			classNames={
				{
					// label: !Boolean(error?.message) ? '!text-primary-500' : ''
				}
			}
			color={color}
			type={type}
			size={size}
			labelPlacement={labelPlacement}
			variant={variant}
			ref={ref}
			value={value}
			onChange={e => onChange(e.target.value)}
			isInvalid={Boolean(error?.message)}
			errorMessage={error?.message}
			{...restProps}
		/>
	)
}
