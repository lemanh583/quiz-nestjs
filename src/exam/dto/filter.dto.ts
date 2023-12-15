import { IsInt, IsOptional, IsString } from "class-validator"

export class FilterDto {
    @IsOptional()
    @IsString()
    type?: string

    @IsOptional()
    @IsString()
    lang_type?: string

    @IsOptional()
    @IsInt({ each: true })
    category_ids?: number[]
}