import { IsEmail, IsString, IsNotEmpty, IsOptional } from "class-validator"
import { Expose, Transform } from "class-transformer"

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @IsEmail()
    @Transform(({ value }) => value?.trim())
    email: string

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    name: string
}