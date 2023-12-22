import { ApiProperty } from "@nestjs/swagger"
import { IsInt, IsOptional, IsString } from "class-validator"

export class FilterDto {
    @ApiProperty({})
    @IsOptional()
    @IsString()
    type?: string

    @ApiProperty({})
    @IsOptional()
    @IsString()
    lang_type?: string

    @ApiProperty({ description: "Lọc theo mảng categories" })
    @IsOptional()
    @IsInt({ each: true })
    category_ids?: number[]
}