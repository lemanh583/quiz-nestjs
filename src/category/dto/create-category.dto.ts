import { CategoryType } from "src/common/enum/category.enum";
import { Expose, Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsEnum  } from "class-validator"
import { Slug } from "src/slug/slug.entity";

export class CreateCategoryDto {
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    title: string;

    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    @IsEnum(CategoryType, { message: 'Invalid role' })
    type: CategoryType;
}

export class CreateCategoryDbDto extends CreateCategoryDto {
    slug: Slug;
}