import { CategoryType } from "src/common/enum/category.enum";
import { Expose, Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsEnum, IsOptional  } from "class-validator"
import { Slug } from "src/slug/slug.entity";
import { ExamLangType } from "src/common/enum/exam.enum";

export class CreateCategoryDto {
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    title: string;

    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    @IsEnum(CategoryType, { message: 'Invalid type' })
    type: CategoryType;

    @IsOptional()
    @Transform(({ value }) => value?.trim())
    @IsEnum(ExamLangType, { message: 'Invalid type' })
    lang_type?: ExamLangType;
}

export class CreateCategoryDbDto extends CreateCategoryDto {
    slug: Slug;
}