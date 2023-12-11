import { Expose, plainToClass } from "class-transformer"

export abstract class BaseDto {
    @Expose()
    created_at: Date

    @Expose()
    updated_at: Date

    @Expose()
    id: number

    static plainToClass<T>(this: new (...args: any[]) => T, plain: T) {
        return plainToClass(this, plain, { excludeExtraneousValues: true, enableImplicitConversion: true})
    }
}