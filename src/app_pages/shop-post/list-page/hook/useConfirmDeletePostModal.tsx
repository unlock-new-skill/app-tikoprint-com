/* eslint-disable @next/next/no-img-element */
import { ShopPostDto, shopPostService } from '@api/shopPostService'
import { useGridListContext } from '@components/gridlist'
import { Button, Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react'
import { useRequest } from 'ahooks'
import { useState } from 'react'
import { toast } from 'react-toastify'

interface Props {
	data: ShopPostDto
}

export default function useConfirmDeletePostModal({ data: post }: Props) {
	const { triggerRefreshList } = useGridListContext()
	const [open, setOpen] = useState(false)

	const handleOpen = () => {
		setOpen(true)
	}
	const handleClose = () => {
		setOpen(false)
	}

	const { run, loading } = useRequest(shopPostService.delete, {
		manual: true,
		onSuccess: () => {
			handleClose()
			triggerRefreshList()
			toast.success('Deleted')
		}
	})

	const render = () => {
		return (
			<Modal
				onClose={handleClose}
				isOpen={open}
				// size="5xl"
				title="Are you sure to delete"
			>
				<ModalContent>
					<ModalHeader>
						<p className="text-danger-500 font-[400]">
							Are you sure to delete this post?
						</p>
					</ModalHeader>
					<ModalBody className="p-4">
						<div className="mx-auto shadow-common-box rounded-md overflow-hidden p-3">
							<img
								src={post?.thumnail_image}
								alt="1"
								className="max-w-[160px] aspect-[2/3]"
							/>
							<p className="my-3">{post?.title}</p>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<Button aria-label="button" onPress={handleClose}>
								Cancel
							</Button>
							<Button
								aria-label="button"
								onPress={() => run(post.id as string)}
								isLoading={loading}
								color="danger"
							>
								Delete
							</Button>
						</div>
					</ModalBody>
				</ModalContent>
			</Modal>
		)
	}

	return {
		handleOpenDeletePostModal: handleOpen,
		renderDeletePostModal: render
	}
}
