import { useController } from 'react-hook-form'
import { BaseRadioGroupPropsDto } from './data-input.dto'
import { Radio, RadioGroup } from '@nextui-org/react'

export default function BaseRadioGroup(props: BaseRadioGroupPropsDto) {
	const {
		color = 'default',
		size = 'sm',
		valueType = 'string',
		options,
		radioClassName = '',
		...restProps
	} = props

	const {
		field: { onChange, ref, value },

		fieldState: { error }
	} = useController({
		name: props.name,
		control: props.control
	})

	const handleValueChange = (v: string) => {
		if (valueType === 'boolean') {
			if (v === 'true') {
				onChange(true)
			}
			onChange(false)
		}
		if (valueType === 'number' && Number(v)) {
			onChange(Number(v))
		}
		onChange(v)
	}

	return (
		<RadioGroup
			color={color}
			classNames={{
				label: 'text-small text-default-600'
			}}
			size={size}
			ref={ref}
			value={String(value)}
			onValueChange={handleValueChange}
			isInvalid={Boolean(error?.message)}
			errorMessage={error?.message}
			{...restProps}
		>
			{options.map((i, index) => (
				<Radio
					key={index}
					value={String(i.value)}
					description={i?.description}
					className={radioClassName}
				>
					{i.label}
				</Radio>
			))}
		</RadioGroup>
	)
}
