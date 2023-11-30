import { Transform } from "class-transformer"
import { IsNumber, IsOptional, IsString, Min } from "class-validator"

export const defaultParamList: {
    order: object,
    skip: number,
    take: number,
} =  { ...{
    order: { created_at: "DESC" },
    skip: 0,
    take: 20
}}

export function TestParam() {
    console.log("Testing", defaultParamList)
}


export class BaseListFilterDto <T, K> {
    @IsOptional()
    filter?: T

    @IsOptional()
    @IsNumber()
    @Min(1)
    limit?: number

    @IsOptional()
    @IsNumber()
    @Min(1)
    page?: number

    @IsOptional()
    @Transform(({ value }) => value?.trim())
    @IsString()
    search?: string
    
    @IsOptional()
    sort?: K
}