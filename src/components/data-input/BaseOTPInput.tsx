import { useController } from 'react-hook-form'
import { BaseInputPropDto } from './data-input.dto'
import { InputOtp } from '@nextui-org/react'
import clsx from 'clsx'

export default function BaseOTPInput(props: BaseInputPropDto & { length: number }) {
	const {
		color = 'default',
		type = 'text',
		variant = 'flat',
		size = 'sm',
		label,
		isRequired,
		length,
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
		<div className={clsx('flex flex-col gap-1')}>
			<label className="text-[0.8rem] text-foreground-500">
				{label} {isRequired ? <span className="text-danger-400 ">*</span> : ''}
			</label>
			<InputOtp
				length={length}
				classNames={
					{
						// label: !Boolean(error?.message) ? '!text-primary-500' : ''
					}
				}
				color={color}
				type={type}
				size={size}
				variant={variant}
				ref={ref}
				value={value}
				onChange={e => onChange(e)}
				isInvalid={Boolean(error?.message)}
				errorMessage={error?.message}
				{...restProps}
			/>
		</div>
	)
}
