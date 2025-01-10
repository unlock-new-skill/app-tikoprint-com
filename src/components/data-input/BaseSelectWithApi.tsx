import { useController } from 'react-hook-form'
import { BaseSelectWithApiPropsDto } from './data-input.dto'
import { Input, Select, SelectItem } from '@nextui-org/react'
import { useRequest } from 'ahooks'
import { useMemo, useState } from 'react'
import { get } from 'lodash'
import { MdSearch } from 'react-icons/md'

export default function BaseSelectWithApi<QueryDto, DataDto>(
	props: BaseSelectWithApiPropsDto<QueryDto, DataDto>
) {
	const {
		color = 'default',
		variant = 'flat',
		size = 'sm',
		isMultiline = false,
		apiService,
		searchKey,
		valuePath,
		labelPath,
		customRenderOption,
		...restProps
	} = props

	const {
		field: { onChange, ref, value },
		fieldState: { error }
	} = useController({
		name: props.name,
		control: props.control
	})

	const [search, setSearch] = useState('')

	const { data, loading } = useRequest(
		() => apiService({ [searchKey]: search, pageSize: 1000 } as QueryDto),
		{ refreshDeps: [search] }
	)

	const options = useMemo(() => {
		if (data?.data.data.dataTable) {
			return data?.data.data.dataTable.map((i: DataDto, index) => ({
				item: i,
				label: get(i, labelPath),
				value: get(i, valuePath),
				key: index
			}))
		}
		return []
	}, [JSON.stringify(data?.data)])
	return (
		<Select
			// input
			classNames={
				{
					// label: !Boolean(error?.message) ? '!text-primary-500' : ''
				}
			}
			isLoading={loading}
			items={[{ key: 'search', value: 'search', label: '' }, ...options]}
			isMultiline={isMultiline}
			color={color}
			size={size}
			labelPlacement="inside"
			variant={variant}
			ref={ref}
			value={value}
			selectedKeys={[value]}
			onChange={e => onChange(e.target.value)}
			isInvalid={Boolean(error?.message)}
			errorMessage={error?.message}
			{...restProps}
		>
			{option => {
				if (option.key === 'search') {
					// Render input cho item tìm kiếm
					return (
						<SelectItem key={option.key} isReadOnly>
							<Input
								color="primary"
								placeholder="Search..."
								value={search}
								onChange={e => {
									setSearch(e.target.value)
								}}
								size="sm"
								fullWidth
								isClearable
								variant="underlined"
								onClear={() => setSearch('')}
								startContent={
									<MdSearch className="text-[1.4rem] text-primary-500" />
								}
							/>
						</SelectItem>
					)
				}
				// Render các item khác
				return (
					<SelectItem
						key={String(option.value)}
						value={option.value}
						// textValue={option.value}
					>
						{customRenderOption ? customRenderOption(option) : option.label}
					</SelectItem>
				)
			}}
		</Select>
	)
}
