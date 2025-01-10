import { useController } from 'react-hook-form'
import { BaseSelectPropsDto } from './data-input.dto'
import { Select, SelectItem } from '@nextui-org/react'

export default function BaseSelect(props: BaseSelectPropsDto) {
	const {
		color = 'default',
		variant = 'flat',
		size = 'sm',
		isMultiline = false,
		options,
		customRenderOption,
		selectionMode = 'single',
		...restProps
	} = props

	const {
		field: { onChange, ref, value },
		fieldState: { error }
	} = useController({
		name: props.name,
		control: props.control
	})

	return (
		<Select
			classNames={
				{
					// label: !Boolean(error?.message) ? '!text-primary-500' : ''
				}
			}
			items={options}
			isMultiline={isMultiline}
			selectionMode={selectionMode}
			color={color}
			size={size}
			labelPlacement="inside"
			variant={variant}
			ref={ref}
			value={value}
			selectedKeys={
				isMultiline ? (value ?? []).map((i: string) => String(i)) : [String(value)]
			}
			onChange={e => {
				const value = isMultiline
					? e.target.value
							.split(',')
							.map(i => (i === 'false' ? false : i === 'true' ? true : i))
					: e.target.value
				onChange(value)
			}}
			// onSelectionChange={keys => {
			// 	const selectedValue = Array.from(keys)[0] // Lấy giá trị đầu tiên
			// 	onChange(selectedValue) // Cập nhật giá trị vào react-hook-form
			// }}
			isInvalid={Boolean(error?.message)}
			errorMessage={error?.message}
			{...restProps}
		>
			{option => (
				<SelectItem key={String(option.value)} value={String()}>
					{customRenderOption ? customRenderOption(option) : option.label}
				</SelectItem>
			)}
		</Select>
	)
}
