import { Expose } from "class-transformer"

export abstract class BaseDto {
    @Expose()
    created_at: Date

    @Expose()
    updated_at: Date

    @Expose()
    deleted_at: Date | null

    @Expose()
    id: string
}