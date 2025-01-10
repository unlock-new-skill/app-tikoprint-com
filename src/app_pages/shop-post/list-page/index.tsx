/* eslint-disable @next/next/no-img-element */

import { QueryListPostDto, ShopPostDto, shopPostService } from '@api/shopPostService'
import GridList from '@components/gridlist'
import { Link } from 'react-router-dom'
import { Button, Divider, Switch, Tooltip } from '@nextui-org/react'
import { MdDelete, MdEditSquare } from 'react-icons/md'
import { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa6'
import { useDebounceFn } from 'ahooks'
import useConfirmDeletePostModal from './hook/useConfirmDeletePostModal'
import FormFilterPost from './components/FormFilterPost'
import { useTranslation } from 'react-i18next'

export default function PostListPage() {
	const { t } = useTranslation('discount')
	return (
		<div className="flex flex-col gap-2">
			<div className="flex justify-between items-center ">
				<h3 className="font-normal">{t('title.discount_program')}</h3>
				<Link to={'/shop/post/new'}>
					<Button aria-label="button" size="sm" color="primary">
						+ New Post
					</Button>
				</Link>
			</div>
			<Divider />
			<GridList<ShopPostDto, QueryListPostDto>
				gridClassName="md:grid-cols-2 grid 2xl:grid-cols-6 gap-2 "
				apiService={shopPostService.list}
				renderCard={data => <RenderCard data={data} key={data?.id} />}
				renderForm={setQuery => <FormFilterPost setQuery={setQuery} />}
			/>
		</div>
	)
}

interface RenderCardProps {
	data: ShopPostDto
}
function RenderCard({ data }: RenderCardProps) {
	const [active, setActive] = useState(data.active)
	const onChangeActive = (checked: boolean) => {
		setActive(checked)
		shopPostService.changeActiveStatus({ active: checked }, data.id as string)
	}
	const { run: handleChangeActive } = useDebounceFn(onChangeActive, {
		wait: 500
	})

	const { handleOpenDeletePostModal, renderDeletePostModal } = useConfirmDeletePostModal({ data })

	return (
		<div
			key={data.id}
			className="group shadow-common-box duration-300 transition-all rounded-md overflow-hidden"
		>
			<img src={data.thumnail_image} alt="1" className="aspect-video" />

			<div className="flex flex-col gap-1 px-3 py-2">
				<p className="text-center line-clamp-2 h-[3rem]">{data.title}</p>
				<div className="flex items-center gap-1.5 justify-between drop-shadow-md bg-foreground-100 rounded-md px-2 py-1">
					<div className="flex gap-1 h-max items-center text-[0.8rem] bg-foreground-200 px-1 rounded-md">
						<FaEye /> <span> {data.view}</span>
					</div>
					<div className="flex gap-1 items-center">
						<Tooltip content="Active status" color="success">
							<div>
								<Switch
									onChange={e => handleChangeActive(e.target.checked)}
									isSelected={active}
									thumbIcon={
										active ? (
											<FaEye className="text-primary-500" />
										) : (
											<FaEyeSlash />
										)
									}
									color="success"
								/>
							</div>
						</Tooltip>
						<Tooltip content="Edit Post" color="primary">
							<Link to={`/shop/post/${data.id}`} className="text-[0.8rem]">
								<Button
									aria-label="button"
									size="sm"
									color="primary"
									variant="bordered"
									isIconOnly
								>
									<MdEditSquare />
								</Button>
							</Link>
						</Tooltip>
						<Tooltip content="Delete Post" color="danger">
							<Button
								aria-label="button"
								size="sm"
								color="danger"
								variant="bordered"
								isIconOnly
								onPress={() => handleOpenDeletePostModal()}
							>
								<MdDelete />
							</Button>
						</Tooltip>
					</div>
				</div>
			</div>
			{renderDeletePostModal()}
		</div>
	)
}
