import { useController } from 'react-hook-form'
import { BaseInputPropDto } from './data-input.dto'
import { Input } from '@nextui-org/input'

export default function BaseInputNumber(props: BaseInputPropDto) {
	const { color = 'default', size = 'sm', ...restProps } = props

	const {
		field: { onChange, ref, value },
		fieldState: { error }
	} = useController({
		name: props.name,
		control: props.control
	})

	const formatOnchange = (v: string | null) => {
		console.log('🚀 ~ formatOnchange ~ v:', v)
		if (!v || v?.endsWith('.')) {
			return onChange(v)
		}

		const numberValue = v.replace(/[^0-9.]/g, '').replaceAll(',', '')

		onChange(Number(numberValue))
	}

	return (
		<Input
			classNames={
				{
					// label: !Boolean(error?.message) ? '!text-primary-500' : ''
				}
			}
			color={color}
			type="text"
			size={size}
			labelPlacement="inside"
			variant="flat"
			ref={ref}
			value={value && value?.toLocaleString()}
			onChange={e => formatOnchange(e.target.value)}
			isInvalid={Boolean(error?.message)}
			errorMessage={error?.message}
			{...restProps}
		/>
	)
}
