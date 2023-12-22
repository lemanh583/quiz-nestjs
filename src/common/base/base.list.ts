import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsNumber, IsOptional, IsString, Min } from "class-validator"

export const defaultParamList: {
    order: object,
    skip: number,
    take: number,
} = {
    ...{
        order: { created_at: "DESC" },
        skip: 0,
        take: 20
    }
}

export function TestParam() {
    console.log("Testing", defaultParamList)
}


export class BaseListFilterDto<T, K> {
    @ApiProperty({ description: "filter từng loại", required: false })
    @IsOptional()
    filter?: T

    @ApiProperty({ description: "limit", required: false })
    @IsOptional()
    @IsNumber()
    @Min(1)
    limit?: number

    @ApiProperty({ description: "page", required: false })
    @IsOptional()
    @IsNumber()
    @Min(1)
    page?: number

    @ApiProperty({ description: "search", required: false })
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    @IsString()
    search?: string

    @ApiProperty({ description: "sort", required: false })
    @IsOptional()
    sort?: K
}