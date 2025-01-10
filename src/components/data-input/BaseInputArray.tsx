import { useController } from 'react-hook-form'
import { BaseInputPropDto } from './data-input.dto'
import { Button, Chip, Input, Select, SelectItem } from '@nextui-org/react'
import { useMemo, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
// import { useTranslation } from 'react-i18next'

export default function BaseInputArray(props: BaseInputPropDto) {
	const { color = 'default', variant = 'flat', size = 'sm', labelPlacement, ...restProps } = props

	const {
		field: { onChange, ref, value = [] },

		fieldState: { error }
	} = useController({
		name: props.name,
		control: props.control
	})
	// console.log('🚀 ~ value:', value)

	const [inputValue, setInputValue] = useState('')

	const options = useMemo(() => {
		return value.map(i => ({ label: i, value: i }))
	}, [value])
	// console.log('🚀 ~ options ~ options:', options)
	const handleAddOption = () => {
		if (inputValue.trim() && !value.includes(inputValue.trim())) {
			const newOptions = [...value, inputValue.trim()]
			onChange(newOptions)
			setInputValue('')
		}
	}

	// const { t } = useTranslation('common')
	return (
		<Select
			items={[{ key: 'search', value: 'search', label: '' }, ...options]}
			isMultiline={true}
			selectionMode="multiple"
			color={color}
			size={size}
			labelPlacement={labelPlacement}
			variant={variant}
			ref={ref}
			value={value}
			selectedKeys={[...value]}
			onChange={e => onChange(e.target.value)}
			isInvalid={Boolean(error?.message)}
			errorMessage={error?.message}
			renderValue={items => {
				return (
					<div className="flex flex-wrap gap-2">
						{items.map(item => {
							console.log('🚀 ~ BaseInputArray ~ item:', item)
							return (
								<Chip
									size="sm"
									variant="flat"
									color="primary"
									isCloseable
									onClose={() => onChange(value.filter(i => i !== item.key))}
									key={item.key}
								>
									{item.key as string}
								</Chip>
							)
						})}
					</div>
				)
			}}
			{...restProps}
		>
			{option => {
				if (option.key === 'search') {
					// Render input cho item tìm kiếm
					return (
						<SelectItem key={option.key} isReadOnly className="flex flex-col ">
							<div>
								<Input
									className="w-full"
									color="primary"
									placeholder="Enter value..."
									value={inputValue}
									onChange={e => {
										setInputValue(e.target.value)
									}}
									onKeyDown={e => e.key === 'Enter' && handleAddOption()}
									size="sm"
									fullWidth
									endContent={
										<Button
											onPress={handleAddOption}
											isIconOnly
											variant="solid"
											color="primary"
											size="sm"
										>
											<FaPlus />
										</Button>
									}
									variant="underlined"
									onClear={() => setInputValue('')}
								/>
								<p className="text-[0.7rem] text-foreground-600">
									Or press enter to add
								</p>
							</div>
						</SelectItem>
					)
				}
				// Render các item khác
				return (
					<SelectItem
						className="hidden"
						key={String(option.value)}
						value={option.value}
						// textValue={option.value}
						// isDisabled={true}
					>
						:{option.label}
					</SelectItem>
				)
			}}
		</Select>
	)
}
