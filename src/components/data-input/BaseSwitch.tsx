import { useController } from 'react-hook-form'
import { BaseSwitchPropsDto } from './data-input.dto'
import { Switch } from '@nextui-org/react'

export default function BaseSwitch(props: BaseSwitchPropsDto) {
	const { label, isRequired, color = 'primary', size = 'md', ...restProps } = props

	const {
		field: { onChange, ref, value },

		fieldState: { error }
	} = useController({
		name: props.name,
		control: props.control
	})

	return (
		<div className="flex flex-col gap-2">
			<label className="text-[0.8rem] text-foreground-500">
				{label} {isRequired ? <span className="text-danger-400 ">*</span> : ''}
			</label>
			<Switch
				ref={ref}
				color={color}
				size={size}
				isSelected={value}
				onChange={e => onChange(e.target.checked)}
				{...restProps}
			/>

			{error && <span className="text-danger-400 text-sm">{error.message}</span>}
		</div>
	)
}
