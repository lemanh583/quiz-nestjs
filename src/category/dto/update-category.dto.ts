import { CategoryType } from "src/common/enum/category.enum";
import { Expose, Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsBoolean } from "class-validator"
import { Slug } from "src/slug/slug.entity";
import { ApiProperty } from "@nestjs/swagger";
import { ExamLangType } from "src/common/enum/exam.enum";

export class UpdateCategoryDto {
    @ApiProperty({ description: "Không được quá dài", required: false })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    title: string;

    // @ApiProperty({ description: "category type", required: false, enum: CategoryType })
    // @IsOptional()
    // @IsString()
    // @Transform(({ value }) => value?.trim())
    // @IsNotEmpty()
    // @IsEnum(CategoryType, { message: 'Invalid type' })
    // type: CategoryType;


    @ApiProperty({ description: "lang type", required: false, enum: ExamLangType })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    @IsEnum(ExamLangType, { message: 'Invalid type' })
    lang_type: ExamLangType;

    @ApiProperty({ description: "hidden category", required: false })
    @IsOptional()
    @IsBoolean()
    hidden: boolean;
}
