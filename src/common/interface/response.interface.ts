import { HttpStatus } from "@nestjs/common";

export interface ResponseInterface <T>{
    code: HttpStatus,
    success: boolean
    message?: string,
    data?: T,
    list?: Array<T>,
    total?: number
    page?: number
    limit?: number
    [key: string]: any
}