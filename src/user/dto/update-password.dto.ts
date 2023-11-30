import { IsEmail, IsString, IsNotEmpty, IsOptional } from "class-validator"
import { Expose, Transform } from "class-transformer"


export class UpdatePasswordDto {
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    old_password: string

    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    new_password: string
}