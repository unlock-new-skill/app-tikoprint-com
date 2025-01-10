import { useController } from 'react-hook-form'
import { UploadImagePropsDto } from './data-input.dto'
import { ApiException } from '@api/base/base-service.dto'
import { toast } from 'react-toastify'
import clsx from 'clsx'
import { Button } from '@nextui-org/react'
import { useRef, useState } from 'react'
import { RiVideoUploadFill } from 'react-icons/ri'
import ReactPlayer from 'react-player'

export default function UploadVideo(props: UploadImagePropsDto) {
	const {
		control,
		name,
		imageClassName,
		isRequired,
		apiService,
		label,
		containerClassName = ''
	} = props

	const [uploading, setUploading] = useState(false)

	const {
		field: { value, onChange },
		fieldState: { error }
	} = useController({ control, name })

	const inputRef = useRef<HTMLInputElement>(null)

	const handleUploadImage = async (file: File) => {
		setUploading(true)
		try {
			const response = await apiService(file)
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
		<div className={clsx('flex flex-col', containerClassName)}>
			<label className="text-[0.8rem] text-foreground-500">
				{label} {isRequired ? <span className="text-danger-400 ">*</span> : ''}
			</label>
			<div className={clsx('relative pt-1', imageClassName)}>
				{!value ? (
					<div className="w-full h-full flex items-center justify-center bg-foreground-100 rounded-lg">
						<Button aria-label="button" isLoading={uploading}>
							<RiVideoUploadFill className="text-primary-500 text-[2rem] " />
							<span className="text-[0.8rem]">Max 30Mb</span>
						</Button>

						<input
							ref={inputRef}
							type="file"
							accept="*"
							onChange={handleInputChange}
							className="absolute inset-0 opacity-0 cursor-pointer"
						/>
					</div>
				) : (
					<>
						<ReactPlayer
							width={'100%'}
							height={'100%'}
							url={value}
							muted
							controls={true}
						/>
						<Button
							aria-label="button"
							isIconOnly
							className="absolute top-2 right-2 hover:opacity-100 opacity-10"
							onPress={() => onChange(null)}
							size="sm"
						>
							<span className="text-danger-400">X</span>
						</Button>
					</>
				)}
			</div>
			{error && <span className="text-danger-400 text-sm">{error.message}</span>}
		</div>
	)
}
