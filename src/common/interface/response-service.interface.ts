export interface ResponseServiceInterface<T> {
    error: string | null
    data: T | null
    [key: string]: any
}