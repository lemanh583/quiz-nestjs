import { CategoryType } from "src/common/enum/category.enum";
import { Expose, Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsEnum, IsOptional  } from "class-validator"
import { Slug } from "src/slug/slug.entity";
import { ExamLangType } from "src/common/enum/exam.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryDto {
    @ApiProperty({ description: "Không được quá dài" })
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: "Category cho bài thi thì là exam. Cho post thì là post",
        enum: CategoryType,
    })
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    @IsEnum(CategoryType, { message: 'Invalid type' })
    type: CategoryType;

    @ApiProperty({
        required: false, 
        enum: ExamLangType,
        description: "Cái ni là optional. Đối với category viết anh thì set lại là en. Mặc định vi", 
    })
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    @IsEnum(ExamLangType, { message: 'Invalid type' })
    lang_type?: ExamLangType;
}

export class CreateCategoryDbDto extends CreateCategoryDto {
    slug: Slug;
}