import { useController } from 'react-hook-form'
import { BaseInputPropDto } from './data-input.dto'
import { Textarea } from '@nextui-org/input'

export default function BaseTextarea(props: BaseInputPropDto) {
	const { color = 'default', type = 'text', variant = 'flat', size = 'sm', ...restProps } = props

	const {
		field: { onChange, ref, value },
		fieldState: { error }
	} = useController({
		name: props.name,
		control: props.control
	})

	return (
		<Textarea
			classNames={
				{
					// label: !Boolean(error?.message) ? '!text-primary-500' : ''
				}
			}
			color={color}
			type={type}
			size={size}
			labelPlacement="inside"
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
