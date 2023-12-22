import { IsEmail, IsString, IsNotEmpty, IsOptional } from "class-validator"
import { Expose, Transform } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"


export class UpdatePasswordDto {
    @ApiProperty({})
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    old_password: string

    @ApiProperty({})
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    new_password: string
}