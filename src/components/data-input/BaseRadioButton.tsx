import { useController } from 'react-hook-form'
import { BaseRadioGroupPropsDto } from './data-input.dto'
import { Button, ButtonGroup } from '@nextui-org/react'
import clsx from 'clsx'

export default function BaseRadioButton(props: BaseRadioGroupPropsDto) {
	const { label, isRequired, color = 'primary', size = 'md', options } = props

	const {
		field: { onChange, value },

		fieldState: { error }
	} = useController({
		name: props.name,
		control: props.control
	})

	const handleValueChange = (v: string | number | boolean) => {
		onChange(v)
	}

	return (
		<div className={clsx('flex flex-col gap-1')}>
			<label className="text-[0.8rem] text-foreground-500">
				{label} {isRequired ? <span className="text-danger-400 ">*</span> : ''}
			</label>
			<ButtonGroup aria-label="button" size={size}>
				{options.map(o => (
					<Button
						aria-label="button"
						key={String(o.value)}
						color={value === o.value ? color : 'default'}
						onPress={() => handleValueChange(o.value)}
						className="py-1.5 h-auto"
					>
						{o.description}
					</Button>
				))}
			</ButtonGroup>
			{error && <span className="text-danger-400 text-sm">{error.message}</span>}
		</div>
	)
}
