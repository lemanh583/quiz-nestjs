import { CategoryType } from "src/common/enum/category.enum";
import { Expose, Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsEnum, IsOptional  } from "class-validator"
import { Slug } from "src/slug/slug.entity";

export class UpdateCategoryDto {
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    @IsEnum(CategoryType, { message: 'Invalid type' })
    type: CategoryType;
}
