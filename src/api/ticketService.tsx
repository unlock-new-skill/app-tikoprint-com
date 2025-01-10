import BaseService, { CommonPagingProps } from '@api/base/BaseService'
// import { ApiDataRes } from './base/base-service.dto'

export interface TicketDto {
	id?: string
	title: string
	description: string
	createdAt?: string
	status?: string
	type: string

	TicketChat?: TicketChat[]
}
export interface TicketChat {
	message?: string
	sender_name?: string
	role?: string
	createdAt?: string
}

export interface QueryListTicketDto extends CommonPagingProps {
	title?: string
	status?: string
	type?: string
}

class Ticket extends BaseService<TicketDto, QueryListTicketDto> {
	BASE_ENDPOINT = '/api/seller/ticket'

	closeTicket = (ticketId: string) => {
		return this.request.post(`${this.BASE_ENDPOINT}/${ticketId}/close`)
	}

	chat = (ticketId: string, data: { message: string }) => {
		return this.request.post(`${this.BASE_ENDPOINT}/${ticketId}/chat`, data)
	}
}

export const ticketService = new Ticket()
