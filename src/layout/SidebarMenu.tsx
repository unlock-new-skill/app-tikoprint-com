import { ReactElement } from 'react'
import { MdDashboard } from 'react-icons/md'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import { FaCaretSquareLeft, FaMoneyBill, FaPager, FaStore } from 'react-icons/fa'
type ItemType = 'item' | 'group'
import { BiSolidCategoryAlt, BiSolidPackage, BiWorld } from 'react-icons/bi'
import { useLayoutContext } from './Layout'
import clsx from 'clsx'
import {
	Avatar,
	Button,
	ButtonGroup,
	Chip,
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@nextui-org/react'
import { useUserContext } from '@providers/UserProvider'
import { GiClothes } from 'react-icons/gi'
import { BsFillPostcardFill, BsThreeDotsVertical } from 'react-icons/bs'
import { Image } from '@nextui-org/react'
import { RiDiscountPercentLine } from 'react-icons/ri'

import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { FaTicket } from 'react-icons/fa6'
// import { ChangeLanguage } from '@app_pages/homepage/components/Header'
interface ItemProps {
	link: string
	label: string
	icon: ReactElement
	type: ItemType
	children?: ItemProps[]
}

export default function SideBarMenu() {
	const { collapsed, toggleCollapseSidebar } = useLayoutContext()
	const router = useNavigate()

	const { t } = useTranslation('common')

	const items: ItemProps[] = [
		{
			link: '/dashboard',
			label: t('sidebar.overview'),
			icon: (
				<div className="p-1 border rounded-md border-primary-500">
					<MdDashboard className="text-primary-500" />{' '}
				</div>
			),
			type: 'item'
		},
		{
			link: '#',
			label: t('sidebar.shop'),
			icon: (
				<div className="p-1 border rounded-md border-primary-500">
					<FaStore className="text-primary-500" />
				</div>
			),
			type: 'group',
			children: [
				{
					link: '/shop/catalog',
					label: t('sidebar.catalog'),
					icon: <BiSolidCategoryAlt className="text-primary-500" />,
					type: 'item'
				},
				{
					link: '/shop/product',
					label: t('sidebar.product'),
					icon: <GiClothes className="text-primary-500" />,
					type: 'item'
				},

				{
					link: '/shop/discount',
					label: t('sidebar.discount'),
					icon: <RiDiscountPercentLine className="text-primary-500" />,
					type: 'item'
				},
				{
					link: '/shop/print-and-ship',
					label: t('sidebar.order'),
					icon: <BsFillPostcardFill className="text-primary-500" />,
					type: 'item'
				},
				{
					link: '/shop/post',
					label: t('sidebar.post'),
					icon: <BsFillPostcardFill className="text-primary-500" />,
					type: 'item'
				},
				{
					link: '/shop/config',
					label: t('sidebar.config'),
					icon: <FaPager className="text-primary-500" />,
					type: 'item'
				}
			]
		},
		// {
		// 	link: '#',
		// 	label: 'Catalog',
		// 	icon: <BiSolidCategoryAlt className="text-primary-500" />,
		// 	type: 'group',
		// 	children: [
		// 		{
		// 			link: '/catalog/category',
		// 			label: 'Category',
		// 			icon: <BiSolidCategoryAlt className="text-primary-500" />,
		// 			type: 'item'
		// 		},
		// 		{
		// 			link: '/catalog/product',
		// 			label: 'Product',
		// 			icon: <AiFillProduct className="text-secondary-500" />,
		// 			type: 'item'
		// 		}
		// 	]
		// },

		{
			link: '/print-and-ship ',
			label: t('sidebar.fulfill_order'),
			icon: (
				<div className="p-1 border rounded-md border-primary-500">
					<BiSolidPackage className="text-primary-500" />
				</div>
			),
			type: 'item'
		},
		{
			link: '/balance',
			label: t('sidebar.balance'),
			icon: (
				<div className="p-1 border rounded-md border-primary-500">
					<FaMoneyBill className="text-primary-500" />
				</div>
			),
			type: 'item'
		},
		{
			link: '/ticket',
			label: 'Ticket',
			icon: (
				<div className="p-1 border rounded-md border-primary-500">
					<FaTicket className="text-primary-500" />
				</div>
			),
			type: 'item'
		}
		// {
		// 	link: '/account',
		// 	label: 'Account',
		// 	icon: (
		// 		<div className="p-1 border rounded-md border-primary-500">
		// 			<FaUser className="text-primary-500" />
		// 		</div>
		// 	),
		// 	type: 'item'
		// }
	]

	console.log(t('navbar.overview'))
	function goToPage(link: string) {
		router(link)
	}

	return (
		<div
			className={clsx('h-screen flex flex-col justify-between transition-all duration-300', {
				'max-w-[220px]': !collapsed,
				'max-w-[60px]': collapsed
			})}
		>
			<AppLogo collapsed={collapsed} />
			<Sidebar
				collapsed={collapsed}
				collapsedWidth="60px"
				className="flex-1 "
				width={'220px'}
			>
				<Menu
				// menuItemStyles={{
				// 	button: ({ level, active }) => {
				// 		console.log('🚀 ~ SideBarMenu ~ active:', active)
				// 		console.log('🚀 ~ SideBarMenu ~ level:', level)

				// 		return {
				// 			color: !active ? 'black' : '',
				// 			backgroundColor: active ? '#006fee' : undefined
				// 		}
				// 	}
				// }}
				>
					{items.map((i, index) =>
						i.type === 'item' ? (
							<MenuItem
								key={index}
								icon={i.icon}
								onClick={() => goToPage(i.link)}
								className="[&>a]:!px-2"
							>
								{i.label}
							</MenuItem>
						) : (
							<SubMenu
								key={index}
								label={i.label}
								icon={i.icon}
								className="[&>a]:!px-2 [&>div>ul]:bg-foreground-100 "
							>
								{i.children?.map(i2 => (
									<MenuItem
										className="[&>a]:!pl-6 "
										key={`${i}-${i2.link}`}
										icon={i2.icon}
										onClick={() => goToPage(i2.link)}
									>
										{i2.label}
									</MenuItem>
								))}
							</SubMenu>
						)
					)}
				</Menu>
			</Sidebar>

			<div className="border-r p-1 border-t">
				<User collapsed={collapsed} />
				{collapsed && (
					<Button
						aria-label="button"
						className={clsx('mt-1 mx-auto border-1', {
							'w-full': !collapsed,
							'min-w-[2.5rem]': collapsed
						})}
						size="sm"
						variant="bordered"
						color="primary"
						onPress={toggleCollapseSidebar}
					>
						<FaCaretSquareLeft
							className={clsx('text-primary-500 text-xl', {
								'rotate-180': collapsed,
								'rotate-0': !collapsed
							})}
						/>
					</Button>
				)}

				{!collapsed && (
					<div className="flex gap-2 justify-center items-center">
						<ChangeLanguage />
						<Button
							aria-label="button"
							size="sm"
							variant="bordered"
							color="primary"
							onPress={toggleCollapseSidebar}
							isIconOnly
							className="border-1"
						>
							<FaCaretSquareLeft
								className={clsx('text-primary-500 text-xl', {
									'rotate-180': collapsed,
									'rotate-0': !collapsed
								})}
							/>
						</Button>
					</div>
				)}
			</div>
		</div>
	)
}

function AppLogo({ collapsed }: { collapsed: boolean }) {
	console.log('🚀 ~ AppLogo ~ collapsed:', collapsed)

	return (
		<div className={clsx(' flex justify-center p-2 border-r', {})}>
			<div className="relative aspect-[1.4/1] w-full max-w-[100px]">
				<Image src={'/images/logo.png'} alt="1" title="Tiko Print" />
			</div>
		</div>
	)
}

function User({ collapsed }: { collapsed: boolean }) {
	const { user } = useUserContext()
	console.log('🚀 ~ User ~ user:', user)
	const { t } = useTranslation('common')
	return (
		<Popover placement="top" showArrow>
			<PopoverTrigger>
				<div className="flex gap-2 bg-white p-2 rounded-md items-center w-max mx-auto cursor-pointer">
					<Avatar size="md" src="https://placecats.com/300/200" />
					{!collapsed && (
						<>
							<p className="truncate">{user?.first_name}</p>
							<BsThreeDotsVertical />
						</>
					)}
				</div>
			</PopoverTrigger>
			<PopoverContent>
				<div className="flex flex-col gap-1 py-2">
					<Link to={'/balance/deposit'}>
						<Chip size="md" variant="bordered" color="primary">
							{t('label.balance')}: {user?.balance}$
						</Chip>
					</Link>

					<Button
						variant="flat"
						color="danger"
						size="sm"
						onPress={() => {
							localStorage.clear()
							sessionStorage.clear()
							window.location.pathname = '/auth/login'
						}}
					>
						{t('label.logout')}{' '}
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	)
}

export function ChangeLanguage() {
	const {
		i18n: { language, changeLanguage }
	} = useTranslation()
	// console.log('🚀 ~ ChangeLanguage ~ router:', router)
	// const changeLanguage = (lng: 'vi' | 'en') => {
	// 	Cookies.set('NEXT_LOCALE', lng, { expires: 365 })
	// 	router.push(router.asPath, router.asPath, {
	// 		locale: lng
	// 	})
	// }

	return (
		<ButtonGroup>
			<Button
				size="sm"
				className={clsx('flex gap-1', {
					'bg-red-500 text-white': language === 'vi'
				})}
				onPress={() => changeLanguage('vi')}
			>
				{language === 'vi' && (
					<Image
						width={16}
						height={16}
						className="rounded-sm"
						src={
							'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/510px-Flag_of_Vietnam.svg.png'
						}
						alt="vi"
					/>
				)}

				<span>Vi</span>
			</Button>

			<Button
				size="sm"
				onPress={() => changeLanguage('en')}
				className={clsx('flex gap-1', {
					'bg-primary-500 text-white': language === 'en'
				})}
			>
				<BiWorld />

				<span>En</span>
			</Button>
		</ButtonGroup>
	)
}
