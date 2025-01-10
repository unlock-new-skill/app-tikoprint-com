/* eslint-disable @next/next/no-img-element */
import { ShopPostDto } from '@api/shopPostService'
import clsx from 'clsx'
import moment from 'moment'
import { Link } from 'react-router-dom'
export default function PreviewPost(post: Partial<ShopPostDto>) {
	const formattedDate = moment().format(' MMMM.DD.YYYY')
	// console.log('🚀 ~ Post ~ formattedDate:', formattedDate)
	return (
		<article className={clsx('rounded-md max-h-[95vh] overflow-y-scroll', {})}>
			<header className="flex flex-col gap-4">
				{post?.cover_image && (
					<div className="relative  rounded-md overflow-hidden">
						<img title={post?.title} alt={post?.title ?? ''} src={post?.cover_image} />
					</div>
				)}
				<h1 className="font-[600] text-[1.6rem] rounded-md shadodow-md text-orange">
					{post.title}
				</h1>
				<p>{post?.description}</p>
				<p className="mb-2">
					<strong>Shop name</strong>
					<time className="pl-4" dateTime={moment().format('YYYY-MM-DD')}>
						{formattedDate}
					</time>
				</p>
			</header>
			<div className="flex flex-col gap-2 border-y bg-gray-100 drop-shadow-sm   p-4 rounded-md mb-2 ">
				<p className="font-[500] text-orange ">Table of Contents</p>
				<ol className="list-decimal ml-2 md:pl-3">
					{post?.content?.map((s, s_index) => (
						<li
							key={s_index}
							className="font-[500] transition-all duration-250 hover:text-orange"
						>
							<Link to={`#section_${s_index}`}>{s?.title}</Link>
						</li>
					))}
				</ol>
			</div>

			{(post?.content ?? []).map((s, s_index) => (
				<section key={`s_${s_index}`} id={`section_${s_index}`}>
					<h2 className="text-orange font-[600] text-[1.2rem] my-3 md:my-4">{s.title}</h2>
					<div
						className="[&>*]:mt-2 md:mt-2.5"
						dangerouslySetInnerHTML={{ __html: s.content }}
					></div>
				</section>
			))}

			<footer>
				{/* <p>
						<strong>Từ khóa liên quan:</strong> {post?.seoKeywords}
					</p> */}
				{/* <FacebookShareButton /> */}
			</footer>
		</article>
	)
}
