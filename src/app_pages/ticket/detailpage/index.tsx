/* eslint-disable @typescript-eslint/no-explicit-any */
import { TicketDto, ticketService } from '@api/ticketService'
// import { useBaseTableContext } from '@components/base-table'
import { BaseInput, BaseSelect, RichTextEditor } from '@components/data-input'
import yup from '@helper/yup-valiator'
import { yupResolver } from '@hookform/resolvers/yup'
import {
	// Drawer,
	// DrawerContent,
	// DrawerHeader,
	// DrawerBody,
	Button,
	CircularProgress,
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@nextui-org/react'
import { useUserContext } from '@providers/UserProvider'
import { useRequest } from 'ahooks'
import clsx from 'clsx'
import moment from 'moment'
import { useEffect } from 'react'
// import { useState } from 'react'
import { useFieldArray, UseFieldArrayAppend, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

export interface OpenTicketDrawerProps {
	initData?: {
		title: string
		type: string
	}
	ticket_id?: string
}

export default function DetailTicket() {
	const { t } = useTranslation('ticket')
	const { id } = useParams()
	const { state } = useLocation()
	const navigate = useNavigate()
	const schema = yup.object().shape({
		title: yup.string().required(t('message.required_field')).min(20),
		type: yup.string().required(t('message.required_field')),
		description: yup.string().required(t('message.required_field')).min(20),
		status: yup.string(),
		TicketChat: yup.array().of(
			yup.object().shape({
				message: yup.string(),
				sender_name: yup.string(),
				role: yup.string(),
				created_at: yup.string()
			})
		)
	})

	const {
		control,
		// setValue,
		watch,
		reset,
		formState: { isSubmitting, isDirty },
		handleSubmit
	} = useForm<TicketDto>({
		mode: 'onTouched',
		resolver: yupResolver(schema)
	})
	// console.log('🚀 ~ useTicketDetailDrawer ~ errors:', errors)

	useEffect(() => {
		if (state) {
			reset({
				title: state.title,
				type: state.type,
				status: 'OPENING'
			})
		}
	}, [JSON.stringify(state)])

	const status = watch('status')

	const onSubmit = handleSubmit(async data => {
		try {
			const r = await ticketService.save(data)
			toast.success(r.data.message)
			navigate(-1)
		} catch (e: any) {
			toast.error(e?.message)
		}
	})

	const { loading: loadingTicketDetail, run: getTicketDetail } = useRequest(ticketService.find, {
		manual: true,
		onSuccess: data => {
			console.log('🚀 ~ useTicketDetailDrawer ~ data:', data)
			reset({
				...data.data.data
			})
		}
	})
	useEffect(() => {
		if (id && id !== 'new') {
			getTicketDetail(id as string)
		}
	}, [id])

	const { append, fields } = useFieldArray({
		control,
		name: 'TicketChat'
	})

	const { run: close, loading: loadingClose } = useRequest(ticketService.closeTicket, {
		manual: true,
		onSuccess: () => {
			navigate('/ticket')
		},
		onError: (e: any) => {
			toast.error(e?.message)
		}
	})

	return (
		<div>
			<div className="flex gap-4  items-center mb-3">
				<Button color="primary" size="sm" onPress={() => navigate(-1)}>
					{t('button.back')}
				</Button>
				{t('title.ticket_information')}
			</div>
			<div>
				{loadingTicketDetail ? (
					<div className="flex justify-center items-center min-h-[400px]">
						<CircularProgress />
					</div>
				) : (
					<form className="flex  gap-4 " onSubmit={onSubmit}>
						<div className="flex flex-col  gap-2 max-w-[600px] p-2 ">
							<BaseInput
								control={control}
								name="title"
								label={t('label.title')}
								isRequired
								isReadOnly={id !== 'new'}
							/>
							<div className="flex gap-2 items-baseline">
								<BaseSelect
									isDisabled={id !== 'new'}
									control={control}
									name="type"
									label={t('label.type')}
									isRequired
									disabledKeys={['WITHDRAW']}
									options={[
										{
											label: t('label.CANCEL_ORDER'),
											value: 'CANCEL_ORDER'
										},
										{
											label: t('label.WITHDRAW'),
											value: 'WITHDRAW'
										},
										{
											label: t('label.SUPPORT'),
											value: 'SUPPORT'
										},
										{
											label: t('label.DEPOSIT'),
											value: 'DEPOSIT'
										}
									]}
								/>
							</div>

							<RichTextEditor
								disabled={id !== 'new'}
								control={control}
								name="description"
								isRequired
								label={t('label.description')}
								height={400}
								placeholder={t('placeholder.description')}
							/>
							{id === 'new' ? (
								<Button
									isDisabled={!isDirty}
									isLoading={isSubmitting}
									color="primary"
									type="submit"
								>
									{t('button.create_new_ticket')}
								</Button>
							) : status === 'OPENING' ? (
								<Popover content={'button.close_ticket'}>
									<PopoverTrigger>
										<Button variant="bordered" color="primary">
											{t('button.close_ticket')}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="flex flex-col gap-3 p-6">
										<p>{t('label.confirm_close_ticket')}</p>
										<Button
											onPress={() => close(id as string)}
											isLoading={loadingClose}
											color="primary"
										>
											{t('button.confirm')}{' '}
										</Button>
									</PopoverContent>
								</Popover>
							) : null}
						</div>
						{id !== 'new' && (
							<div className="flex flex-col gap-2  border rounded-md p-2 max-w-[800px] ">
								{fields.length === 0 ? (
									<p>{t('label.no_chat_to_display')}</p>
								) : (
									<p className="h-max">{t('label.message')}</p>
								)}
								<div className="grid grid-cols-1 gap-3 h-[55vh] overflow-y-scroll py-1 ">
									{fields.map(field => {
										return (
											<div
												className={clsx('flex ', {
													'justify-start': field?.role === 'SELLER',
													'justify-end': field?.role !== 'SELLER'
												})}
												key={field.id}
											>
												<div
													className={clsx('rounded-md p-3 h-max', {
														'bg-foreground-100 shadow-sm':
															field?.role === 'SELLER',
														'justify-end': field?.role !== 'SELLER'
													})}
												>
													<p className="text-foreground-500 text-[0.6rem]">
														{field?.sender_name} [
														{moment(field?.createdAt).format(
															'hh:mm MM.DD.YYYY'
														)}
														]
													</p>
													<div
														className="text-[0.8rem]"
														dangerouslySetInnerHTML={{
															__html: field?.message as string
														}}
													/>
												</div>
											</div>
										)
									})}
								</div>
								{status === 'OPENING' && <ChatForm append={append} />}
							</div>
						)}
					</form>
				)}
			</div>
		</div>
	)
}

function ChatForm({ append }: { append: UseFieldArrayAppend<TicketDto, 'TicketChat'> }) {
	const { user } = useUserContext()
	const schema = yup.object().shape({
		message: yup.string().min(3).required()
	})
	const { id } = useParams()
	const {
		control,
		formState: { isDirty, isSubmitting },
		handleSubmit
	} = useForm({
		mode: 'onTouched',
		resolver: yupResolver(schema)
	})
	const { t } = useTranslation('ticket')

	const onSubmit = handleSubmit(async data => {
		try {
			await ticketService.chat(id as string, data)
			append({
				message: data.message,
				createdAt: new Date().toUTCString(),
				sender_name: user?.email,
				role: 'SELLER'
			})
			// handleClose()
		} catch (e: any) {
			toast.error(e?.message)
		}
	})

	return (
		<form
			onSubmit={onSubmit}
			className="flex flex-col gap-2 bg-foreground-200 px-4 py-2 rounded-md"
		>
			<RichTextEditor
				isRequired
				control={control}
				name="message"
				label={t('label.message')}
				height={180}
			/>
			<Button
				onPress={onSubmit as any}
				isLoading={isSubmitting}
				isDisabled={!isDirty}
				color="primary"
			>
				{t('button.send')}{' '}
			</Button>
		</form>
	)
}
