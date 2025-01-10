


export class ApiException {
    message: string
    error: string

    constructor(
        message = "An unexpected error occurred",
        error = ""
    ) {
        this.message = message
        this.error = error
    }
}



export interface ApiErrorRes {
    code?: number
    message: string
    error: string
}
export interface ApiDataRes<T> {
    message: string
    data: T,
    code: 0 | 1
}

