import { ApiProperty } from "@nestjs/swagger"
import { IsInt, IsOptional, IsString } from "class-validator"

export class FilterExamDto {
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

    @ApiProperty({ description: "Lọc theo mảng users" })
    @IsOptional()
    @IsInt({ each: true })
    user_ids?: number[]

    @ApiProperty({ description: "Lọc theo mảng users" })
    @IsOptional()
    @IsInt({ each: true })
    topic_ids?: number[]
}