/* eslint-disable @typescript-eslint/no-explicit-any */
import { useController } from 'react-hook-form'
import { BaseInputPropDto } from './data-input.dto'
import { Editor } from '@tinymce/tinymce-react'
import clsx from 'clsx'
import { uploadFileService } from '@api/uploadFileService'
import { toast } from 'react-toastify'
interface CustomDto {
	height?: number
	disabled?: boolean
}
export default function RichTextEditor(props: BaseInputPropDto & CustomDto) {
	const { control, name, label, isRequired, height = 800, ...restValue } = props

	const {
		field: { onChange, value },
		fieldState: { error }
	} = useController({
		name: name,
		control: control
	})

	const handleFileUpload = (blobInfo: any): Promise<string> => {
		// eslint-disable-next-line no-async-promise-executor
		return new Promise(async (resolve, reject) => {
			try {
				// const formData = new FormData()
				// formData.append('file', blobInfo.blob(), blobInfo.filename())
				const file = new File([blobInfo.blob()], blobInfo.filename(), {
					type: blobInfo.blob().type
				})
				const result = await uploadFileService.uploadCommonImage(file)

				return resolve(result?.data.data.url as string)
			} catch (error: any) {
				toast.error(error?.message)
				reject(error?.message)
			}
		})
	}

	return (
		<div className={clsx('flex flex-col gap-1')}>
			<label className="text-[0.8rem] text-foreground-500">
				{label} {isRequired ? <span className="text-danger-400 ">*</span> : ''}
			</label>
			<Editor
				// onInit={(evt, editor) => {}}
				init={{
					convert_urls: false,
					// images_upload_url: 'http://localhost:8000/server.php',
					height,

					images_upload_handler: handleFileUpload,
					menubar: false,
					plugins: [
						// 'advlist',
						'autolink',
						'lists',
						'link',
						'image',
						'charmap',
						'preview',
						'anchor',
						'searchreplace',
						'visualblocks',
						'code',
						'fullscreen',
						'insertdatetime',
						'media',
						'table',
						'code',
						'help',
						'wordcount'
					],
					toolbar:
						'blocks | ' +
						'bold italic forecolor backcolor | link image table |' +
						' alignleft aligncenter alignright alignjustify  | bullist numlist outdent indent | ' +
						'removeformat | help',
					content_style: 'body { font-size: 1rem; max-width: 1200px !important;}'
					// body_class: 'prose mx-auto p-4 bg-white',
					// content_css: '/styles/compiled.css'
				}}
				tinymceScriptSrc={
					'https://cdnjs.cloudflare.com/ajax/libs/tinymce/7.1.2/tinymce.min.js'
				}
				value={value}
				onEditorChange={onChange}
				{...restValue}
			/>
			{error && <span className="text-danger-400 text-sm">{error.message}</span>}
		</div>
	)
}
