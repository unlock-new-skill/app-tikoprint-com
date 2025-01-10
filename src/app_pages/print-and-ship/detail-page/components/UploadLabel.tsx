import { useController } from 'react-hook-form'
import { ApiException } from '@api/base/base-service.dto'
import { toast } from 'react-toastify'
import clsx from 'clsx'
import { Button } from '@nextui-org/react'
import { useRef, useState } from 'react'
import { BaseInputPropDto } from '@components/data-input/data-input.dto'
import { PiFilePdfBold } from 'react-icons/pi'
import { uploadFileService } from '@api/uploadFileService'

export default function UploadLabel(props: BaseInputPropDto) {
	const { control, name, isRequired, label } = props

	const [uploading, setUploading] = useState(false)

	const {
		field: { value, onChange },
		fieldState: { error }
	} = useController({ control, name })

	const inputRef = useRef<HTMLInputElement>(null)

	const handleUploadImage = async (file: File) => {
		setUploading(true)
		try {
			if (file.type !== 'application/pdf') {
				toast.error('Only PDF!')
				return
			}
			const formData = new FormData()
			formData.append('pdf', file)
			const response = await uploadFileService.uploadPdf(formData)
			onChange(response?.data.data.url)
			toast.success('Image uploaded successfully!')
		} catch (e: unknown) {
			if (e instanceof ApiException) {
				toast.error(e.message)
			} else {
				toast.error('An unexpected error occurred')
			}
		} finally {
			setUploading(false)

			if (inputRef.current) inputRef.current.value = ''
		}
	}

	// Xử lý khi người dùng chọn file
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			handleUploadImage(file)
		}
	}

	return (
		<div className={clsx('flex flex-col gap-1')}>
			<label className="text-[0.8rem] text-foreground-500">
				{label} {isRequired ? <span className="text-danger-400 ">*</span> : ''}
			</label>
			<div className={clsx('relative')}>
				{!value ? (
					<div className="w-full py-2 h-full flex items-center justify-center bg-foreground-100 rounded-lg">
						<Button aria-label="button" isIconOnly isLoading={uploading}>
							<PiFilePdfBold className="text-primary-500 text-[1.4rem] " />
						</Button>
						<input
							ref={inputRef}
							type="file"
							accept="application/pdf"
							onChange={handleInputChange}
							className="absolute inset-0 opacity-0 cursor-pointer"
						/>
					</div>
				) : (
					<>{value}</>
				)}
			</div>
			{error && <span className="text-danger-400 text-sm">{error.message}</span>}
		</div>
	)
}
