import GridList from '@components/gridlist'
import { Link } from 'react-router-dom'
import { Button, Divider, Tooltip } from '@nextui-org/react'
import { MdDelete, MdEditSquare } from 'react-icons/md'
// import { FaEye, FaEyeSlash } from 'react-icons/fa6'
import FormFilterPost from './components/FormFilterPost'
import { useTranslation } from 'react-i18next'
import {
	QueryListDiscountDto,
	ShopDiscountDto,
	shopDiscountService
} from '@api/shopDiscountService'
import useConfirmDeleteDiscountModal from './hook/useConfirmDeleteDiscountModal'

export default function DiscountListPage() {
	const { t } = useTranslation('discount')
	return (
		<div className="flex flex-col gap-2">
			<div className="flex justify-between items-center ">
				<h3 className="font-normal">{t('discount_code')}</h3>
				<Link to={'/shop/discount/new'}>
					<Button aria-label="button" size="sm" color="primary">
						+ {t('button.new_code')}
					</Button>
				</Link>
			</div>
			<Divider />
			<GridList<ShopDiscountDto, QueryListDiscountDto>
				gridClassName="md:grid-cols-2 grid 2xl:grid-cols-6 gap-2 "
				apiService={shopDiscountService.list}
				renderCard={data => <RenderCard data={data} key={data?.id} />}
				renderForm={setQuery => <FormFilterPost setQuery={setQuery} />}
			/>
		</div>
	)
}

interface RenderCardProps {
	data: ShopDiscountDto
}
function RenderCard({ data }: RenderCardProps) {
	const { handleOpenDeleteDiscountModal, renderDeleteDiscountModal } =
		useConfirmDeleteDiscountModal({ data })

	return (
		<div
			key={data.id}
			className="group shadow-common-box duration-300 transition-all rounded-md overflow-hidden"
		>
			<div className="flex flex-col gap-1 px-3 py-2">
				<p className="text-center line-clamp-2 h-[3rem]">{data.code}</p>
				<div className="flex items-center gap-1.5 justify-between drop-shadow-md bg-foreground-100 rounded-md px-2 py-1">
					<div className="flex gap-1 h-max items-center text-[0.8rem] bg-foreground-200 px-1 rounded-md">
						Used: <span> {data.used_count}</span>
					</div>
					<div className="flex gap-1 items-center">
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
								onPress={() => handleOpenDeleteDiscountModal()}
							>
								<MdDelete />
							</Button>
						</Tooltip>
					</div>
				</div>
			</div>
			{renderDeleteDiscountModal()}
		</div>
	)
}
