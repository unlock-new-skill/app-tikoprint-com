import { useController } from 'react-hook-form'
import { BaseProps } from './data-input.dto'
import { HexColorPicker } from 'react-colorful'
import { Button, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import { useState } from 'react'
export default function ColorPicker(props: BaseProps) {
	const { control, name, label, isRequired } = props
	const {
		field: { value, onChange },
		fieldState: { error }
	} = useController({ control, name })

	const [open, setOpen] = useState(false)

	return (
		<div className="flex flex-col gap-1">
			<label className="text-[0.8rem] text-foreground-500">
				{label} {isRequired ? <span className="text-danger-400 ">*</span> : ''}
			</label>

			<Popover placement="top" showArrow isOpen={open} onClose={() => setOpen(false)}>
				<PopoverTrigger>
					<div className="flex gap-1">
						<Button
							aria-label="button"
							size="sm"
							variant="bordered"
							color="primary"
							onPress={() => setOpen(true)}
						>
							Choose
						</Button>
						{value && (
							<div className="flex gap-1 items-center">
								<div
									className="w-[26px] h-[26px] rounded-md"
									style={{ backgroundColor: value }}
								/>{' '}
								<span className="text-[0.7rem]">{value}</span>
							</div>
						)}
					</div>
				</PopoverTrigger>
				<PopoverContent>
					<div className="py-2 flex flex-col gap-1">
						<HexColorPicker color={value} onChange={onChange} />
						<div className="grid grid-cols-2 gap-2">
							<div
								style={{
									border: `2px solid ${value ?? 'gray'}`
								}}
								className="text-center p-1"
							>
								{value ?? ''}{' '}
							</div>
							<Button
								aria-label="button"
								size="sm"
								color="primary"
								variant="bordered"
								onPress={() => setOpen(false)}
							>
								Select
							</Button>
						</div>
					</div>
				</PopoverContent>
			</Popover>

			{error && <span className="text-danger-400 text-sm">{error.message}</span>}
		</div>
	)
}
