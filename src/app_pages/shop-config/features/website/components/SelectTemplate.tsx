import {
	QueryListShopTemplateDto,
	ShopTemplateDto,
	shopTemplateService
} from '@api/shopTemplateService'
import GridList from '@components/gridlist'
import { Button, Card, Divider } from '@nextui-org/react'
import SelectTemplateFiler from './SelectTemplateFiler'
import { Link } from 'react-router-dom'
import { TbWorldShare } from 'react-icons/tb'
import { useShopConfigContext } from '@app_pages/shop-config/ShopConfigProvider'
import { MdCheck } from 'react-icons/md'

interface Props {
	onSelect: (id: string) => void
}

export default function SelectTemplate({ onSelect }: Props) {
	return (
		<div>
			<GridList<ShopTemplateDto, QueryListShopTemplateDto>
				gridClassName="md:grid-cols-2 grid 2xl:grid-cols-4 gap-2"
				apiService={shopTemplateService.list}
				renderCard={data => <RenderCard data={data} key={data?.id} onSelect={onSelect} />}
				renderForm={setQuery => <SelectTemplateFiler setQuery={setQuery} />}
			/>
		</div>
	)
}

interface RenderCardProps {
	data: ShopTemplateDto
	onSelect: (id: string) => void
}
function RenderCard({ onSelect, data }: RenderCardProps) {
	console.log('🚀 ~ RenderCard ~ onSelect:', onSelect)
	const { webConfig } = useShopConfigContext()
	return (
		<Card shadow="none">
			<img src={data.preview_image} alt="1" className="aspect-[3/4]" />
			<Divider />
			<div className="p-2 flex flex-col gap-1">
				<p className="truncate ">{data.name}</p>
				<p className="truncate  font-bold text-success-500">
					{' '}
					{data.price === 0 ? 'Free' : `${data.price}$`}
				</p>
				<div className="grid grid-cols-2 gap-2">
					<Link to="#" target="_blank" className="text-[0.8rem]">
						<Button
							aria-label="button"
							size="sm"
							color="primary"
							variant="bordered"
							fullWidth
						>
							<div>
								<TbWorldShare className="text-primary-500" />
							</div>
							Live Preview
						</Button>
					</Link>
					<Button
						aria-label="button"
						size="sm"
						color="primary"
						variant="bordered"
						fullWidth
						isDisabled={data.id === webConfig?.shopTemplateId}
						onPress={() => onSelect(data.id)}
					>
						{data.id === webConfig?.shopTemplateId ? (
							<>
								<div>
									<MdCheck />
								</div>
								Selected
							</>
						) : (
							'Select'
						)}
					</Button>
				</div>
			</div>
		</Card>
	)
}
