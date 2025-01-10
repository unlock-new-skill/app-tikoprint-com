import { useController } from 'react-hook-form'
import { BaseProps } from './data-input.dto'
import { Checkbox } from '@nextui-org/react'

export default function BaseCheckbox(props: BaseProps) {
	const { label, isRequired, color = 'primary', size = 'md', ...restProps } = props

	const {
		field: { onChange, ref, value },

		fieldState: { error }
	} = useController({
		name: props.name,
		control: props.control
	})

	return (
		<div className="flex items-center gap-2">
			<label className="text-[0.8rem] text-foreground-500">
				{label} {isRequired ? <span className="text-danger-400 ">*</span> : ''}
			</label>
			<Checkbox
				ref={ref}
				color={color}
				size={size}
				isSelected={value}
				// checked={true}
				// value={'1'}
				onChange={e => onChange(e.target.checked)}
				{...restProps}
			>
				{' '}
			</Checkbox>
			{error && <span className="text-danger-400 text-sm">{error.message}</span>}
		</div>
	)
}
