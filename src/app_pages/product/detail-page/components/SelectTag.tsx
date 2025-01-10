/* eslint-disable @next/next/no-img-element */
import { useController } from 'react-hook-form'
import { BaseInputPropDto } from '@components/data-input/data-input.dto'
import { useRequest } from 'ahooks'
import { shopCatalogTagService } from '@api/shopCatalogTagService'
import { Button, CircularProgress } from '@nextui-org/react'
import { MdCheck } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { TbReload } from 'react-icons/tb'

export default function SelectTag(props: BaseInputPropDto) {
	const { control, name, label } = props

	const {
		field: { onChange, value = [] },

		fieldState: { error }
	} = useController({
		name: name,
		control: control
	})
	const { data, run, loading } = useRequest(shopCatalogTagService.list, {
		defaultParams: [{ pageSize: 1000, page: 1 }]
	})

	const handleClick = (id: string) => {
		if (!value?.includes(id)) {
			onChange([...value, id])
		} else {
			onChange(value?.filter((i: string) => i !== id))
		}
	}
	return (
		<div className={'flex flex-col gap-1'}>
			<label className="text-[0.8rem] text-foreground-500">{label}</label>
			{loading ? (
				<div className="flex items-center justify-center">
					<CircularProgress />{' '}
				</div>
			) : (
				<div className="flex gap-2 items-center">
					<Button
						aria-label="button"
						isIconOnly
						size="sm"
						color="primary"
						variant="bordered"
						isLoading={loading}
						onPress={() => run({ pageSize: 1000, page: 1 })}
					>
						<TbReload className="text-[1.4rem]" />
					</Button>
					{data?.data.data.dataTable.map(i => (
						<div
							onClick={() => handleClick(i.id as string)}
							key={i.id}
							style={{
								border: `2px solid ${i?.color ?? 'gray'}`
							}}
							className="px-3 relative py-1 rounded-md font-normal flex gap-1 cursor-pointer transition-all duration-200 hover:drop-shadow-md"
						>
							{i?.icon && (
								<img src={i?.icon} alt="t" className="h-[26px] rounded-md" />
							)}
							{i.label}
							{value?.includes(i.id) && (
								<div className="absolute top-[-10px] right-[-8px] bg-primary-500 shadow-md rounded-full p-[2px]">
									<MdCheck className="text-white text-[0.8rem]" />{' '}
								</div>
							)}
						</div>
					))}

					<Link to={'/shop/catalog'} target="_blank">
						<Button aria-label="button" color="primary">
							+ New Tag
						</Button>
					</Link>
				</div>
			)}
			{error && <span className="text-danger-400 text-sm">{error.message}</span>}
		</div>
	)
}
