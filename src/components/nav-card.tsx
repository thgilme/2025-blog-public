'use client'

import Card from '@/components/card'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { useCenterStore } from '@/hooks/use-center'
import { styles as hiCardStyles } from '../app/(home)/hi-card'
import { CARD_SPACING } from '@/consts'
import ScrollOutlineSVG from '@/svgs/scroll-outline.svg'
import ScrollFilledSVG from '@/svgs/scroll-filled.svg'
import ProjectsFilledSVG from '@/svgs/projects-filled.svg'
import ProjectsOutlineSVG from '@/svgs/projects-outline.svg'
import AboutFilledSVG from '@/svgs/about-filled.svg'
import AboutOutlineSVG from '@/svgs/about-outline.svg'
import ShareFilledSVG from '@/svgs/share-filled.svg'
import ShareOutlineSVG from '@/svgs/share-outline.svg'
import WebsiteFilledSVG from '@/svgs/website-filled.svg'
import WebsiteOutlineSVG from '@/svgs/website-outline.svg'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { cn } from '@/lib/utils'
import { useSize } from '@/hooks/use-size'
import { useConfigStore } from '@/app/(home)/stores/config-store'

export const styles = {
	width: 280,
	height: 380, // 修改点1：增加高度，防止内容被截断
	order: 2
}

const list = [
	{
		icon: ScrollOutlineSVG,
		iconActive: ScrollFilledSVG,
		label: '近期文章',
		href: '/blog'
	},
	{
		icon: AboutOutlineSVG,
		iconActive: AboutFilledSVG,
		label: '关于网站',
		href: '/about'
	},
	{
		icon: ShareOutlineSVG,
		iconActive: ShareFilledSVG,
		label: '推荐分享',
		href: '/share'
	},
]

const extraSize = 8

export default function NavCard() {
	const pathname = usePathname()
	const center = useCenterStore()
	const [show, setShow] = useState(false)
	const { maxSM } = useSize()
	const [hoveredIndex, setHoveredIndex] = useState<number>(0)
	const { siteContent } = useConfigStore()

	const activeIndex = useMemo(() => {
		const index = list.findIndex(item => pathname === item.href)
		return index >= 0 ? index : undefined
	}, [pathname])

	useEffect(() => {
		setShow(true)
	}, [])

	let form = useMemo(() => {
		if (pathname == '/') return 'full'
		else if (pathname == '/write') return 'mini'
		else return 'icons'
	}, [pathname])
	if (maxSM) form = 'icons'

	const itemHeight = form === 'full' ? 52 : 28

	let position = useMemo(() => {
		if (form === 'full')
			return {
				x: center.x - hiCardStyles.width / 2 - styles.width - CARD_SPACING,
				y: center.y + hiCardStyles.height / 2 - styles.height
			}

		return {
			x: 24,
			y: 16
		}
	}, [form, center])

	const size = useMemo(() => {
		if (form === 'mini') return { width: 64, height: 64 }
		else if (form === 'icons') return { width: 220, height: 64 }
		else return { width: styles.width, height: styles.height }
	}, [form])

	useEffect(() => {
		if (form === 'icons' && activeIndex !== undefined && hoveredIndex !== activeIndex) {
			const timer = setTimeout(() => {
				setHoveredIndex(activeIndex)
			}, 1500)
			return () => clearTimeout(timer)
		}
	}, [hoveredIndex, activeIndex, form])

	if (maxSM) position = { x: center.x - size.width / 2, y: 16 }

	if (show)
		return (
			<Card
				order={styles.order}
				width={size.width}
				height={size.height}
				x={position.x}
				y={position.y}
				className={clsx('overflow-hidden', form === 'mini' && 'p-3', form === 'icons' && 'flex items-center gap-6 p-3')}>
				<Link className='flex items-center gap-3' href='/'>
					<Image src='/images/avatar.png' alt='avatar' width={40} height={40} style={{ boxShadow: ' 0 12px 20px -5px #E2D9CE' }} className='rounded-full' />
					{form === 'full' && <span className='font-averia mt-1 text-2xl leading-none font-medium'>{siteContent.meta.title}</span>}
				</Link>

				{(form === 'full' || form === 'icons') && (
					<>
						{form !== 'icons' && <div className='text-secondary mt-6 text-sm uppercase'>General</div>}

						{/* 修改点2：父容器只负责定位，移除 space-y-2 */}
						<div className={cn('relative mt-2', form === 'icons' && 'mt-0')}>
							<motion.div
								className='absolute max-w-[230px] rounded-full border'
								layoutId='nav-hover'
								initial={false}
								animate={
									form === 'icons'
										? {
												left: hoveredIndex * (itemHeight + 24) - extraSize,
												top: -extraSize,
												width: itemHeight + extraSize * 2,
												height: itemHeight + extraSize * 2
											}
										: { 
                                            // 公式现在完美匹配 CSS 的 gap-2 (8px)
                                            top: hoveredIndex * (itemHeight + 8), 
                                            left: 0, 
                                            width: '100%', 
                                            height: itemHeight 
                                        }
								}
								transition={{
									type: 'spring',
									stiffness: 400,
									damping: 30
								}}
								style={{ backgroundImage: 'linear-gradient(to right bottom, #FFFFFF 0%, #fafafa 80%)' }}
							/>

							{/* 修改点3：独立的列表容器，使用 flex gap 替代 space，定位更准 */}
							<div className={cn('flex flex-col gap-2', form === 'icons' && 'flex-row items-center gap-6')}>
								{list.map((item, index) => (
									<Link
										key={item.href}
										href={item.href}
                                        // 修改点4：添加 h-[52px] 强制固定高度，确保与 JS 计算一致
                                        // 移除了 py-3，改用 flex items-center 自动垂直居中
										className={cn('text-secondary text-md relative z-10 flex items-center gap-3 rounded-full px-5', 
                                            form === 'full' ? 'h-[52px]' : '', // 只有在完整模式下强制高度
                                            form === 'icons' && 'p-0'
                                        )}
										onMouseEnter={() => setHoveredIndex(index)}>
										<div className='flex h-7 w-7 items-center justify-center'>
											{hoveredIndex == index ? <item.iconActive className='text-brand absolute h-7 w-7' /> : <item.icon className='absolute h-7 w-7' />}
										</div>
										{form !== 'icons' && <span className={clsx(index == hoveredIndex && 'text-primary font-medium')}>{item.label}</span>}
									</Link>
								))}
							</div>
						</div>
					</>
				)}
			</Card>
		)
}
