import { IsEmail, IsString, IsNotEmpty } from "class-validator"
import { Expose, Transform } from "class-transformer"

export class SignUpDto {
    @Expose()
    @IsString()
    @IsEmail()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    email: string

    @Expose()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    name: string

    // @Expose()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    password: string
}