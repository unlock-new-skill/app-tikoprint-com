import { useController } from 'react-hook-form'
import { BaseDateTimeRangePickerPropsDto } from './data-input.dto'
import { DateRangePicker } from '@nextui-org/react'
import { parseZonedDateTime } from '@internationalized/date'
import moment from 'moment'

interface FormatToISODto {
	year: number
	month: number
	day: number
	hour: number
	minute: number
	second: number
}
function formatToISO(date: FormatToISODto | undefined) {
	if (!date) {
		return date
	}
	const { year, month, day, hour, minute, second } = date
	const dateTime = new Date(
		`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(
			hour
		).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`
	)
	return dateTime.toUTCString()
}

export default function BaseDateTimeRangePicker(props: BaseDateTimeRangePickerPropsDto) {
	const {
		color = 'default',
		labelPlacement = 'inside',
		variant = 'flat',
		label,
		size = 'sm',
		timezone,
		...restProps
	} = props

	const {
		field: { onChange, ref, value },

		fieldState: { error }
	} = useController({
		name: props.name,
		control: props.control
	})
	console.log('🚀 ~ value:', value)

	return (
		<DateRangePicker
			color={color}
			size={size}
			labelPlacement={labelPlacement}
			variant={variant}
			ref={ref}
			value={{
				start: parseZonedDateTime(
					`${moment(value?.start).format('YYYY-MM-DDTHH:mm')}[${timezone}]`
				),
				end: parseZonedDateTime(
					`${moment(value?.end).format('YYYY-MM-DDTHH:mm')}[${timezone}]`
				)
			}}
			onChange={e1 => {
				onChange({
					start: formatToISO(e1?.start),
					end: formatToISO(e1?.end)
				})
			}}
			isInvalid={Boolean(error?.message)}
			errorMessage={error?.message}
			{...restProps}
			hideTimeZone
			label={label}
			visibleMonths={2}
		/>
	)
}
