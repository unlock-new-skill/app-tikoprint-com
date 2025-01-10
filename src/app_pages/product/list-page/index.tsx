import { QueryListProductDto, ShopProductDto, shopProductService } from '@api/shopProductService'
import GridList from '@components/gridlist'
import FormFilterProduct from './components/FormFilterProduct'
import { Link } from 'react-router-dom'
import { Button, Divider, Switch, Tooltip } from '@nextui-org/react'
import { MdDelete, MdEditSquare } from 'react-icons/md'
import { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa6'
import { useDebounceFn } from 'ahooks'
import useConfirmDeleteProductModal from './hook/useConfirmDeleteProductModal'

export default function ProductListPage() {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex justify-between items-center ">
				<h3 className="font-normal">Product Manage</h3>
				<Link to={'/shop/product/new'}>
					<Button aria-label="button" size="sm" color="primary">
						+ Create new Product
					</Button>
				</Link>
			</div>
			<Divider />
			<GridList<ShopProductDto, QueryListProductDto>
				gridClassName="md:grid-cols-2 grid 2xl:grid-cols-6 gap-2 "
				apiService={shopProductService.list}
				renderCard={data => <RenderCard data={data} key={data?.id} />}
				renderForm={setQuery => <FormFilterProduct setQuery={setQuery} />}
			/>
		</div>
	)
}

interface RenderCardProps {
	data: ShopProductDto
}
function RenderCard({ data }: RenderCardProps) {
	const [active, setActive] = useState(data.isActive)
	const onChangeActive = (checked: boolean) => {
		setActive(checked)
		shopProductService.changeActiveStatus({ isActive: checked }, data.id)
	}
	const { run: handleChangeActive } = useDebounceFn(onChangeActive, {
		wait: 500
	})

	const { renderDeleteProductModal, handleOpenDeleteProductModal } = useConfirmDeleteProductModal(
		{ data }
	)

	return (
		<div
			key={data.id}
			className="group shadow-common-box duration-300 transition-all rounded-md overflow-hidden"
		>
			<img
				className="aspect-[4/5]"
				src={
					data.images[0] ??
					'https://product.hstatic.net/1000361985/product/kem-_f427d40678d5456288ee6b43129bf3c9.jpg'
				}
				alt="1"
			/>

			<div className="flex flex-col gap-1 px-3 py-2">
				<p className="text-center line-clamp-2 h-[3rem]">{data.name}</p>
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
						<Tooltip content="Edit product" color="primary">
							<Link to={`/shop/product/${data.id}`} className="text-[0.8rem]">
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
						<Tooltip content="Delete Product" color="danger">
							<Button
								aria-label="button"
								size="sm"
								color="danger"
								variant="bordered"
								isIconOnly
								onPress={() => handleOpenDeleteProductModal()}
							>
								<MdDelete />
							</Button>
						</Tooltip>
					</div>
				</div>
			</div>
			{renderDeleteProductModal()}
		</div>
	)
}
