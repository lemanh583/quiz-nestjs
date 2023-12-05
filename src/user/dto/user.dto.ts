import { Expose, plainToClass } from "class-transformer";
import { BaseDto } from "src/common/base/base.dto";

export class UserDto extends BaseDto {
    @Expose()
    email: string

    @Expose()
    role: string

    @Expose()
    name: string

    password: string
}