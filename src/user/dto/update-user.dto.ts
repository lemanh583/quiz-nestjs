import { IsEmail, IsString, IsNotEmpty, IsOptional } from "class-validator"
import { Expose, Transform } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"

export class UpdateUserDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @IsEmail()
    @Transform(({ value }) => value?.trim())
    email: string

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    name: string
}