import { Expose, Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDate, Min, IsInt, IsArray, ArrayUnique, ArrayNotEmpty  } from "class-validator"
import { ExamLangType, ExamType } from "src/common/enum/exam.enum";

export class UpdateExamDto {
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsInt({ each: true })
    category_ids: number[]

    @IsOptional()
    @IsDate()
    time_start: Date

    @IsOptional()
    @IsDate()
    time_end: Date

    @IsOptional()
    @IsInt()
    @Min(0)
    total_generate_question: number

    @IsOptional()
    @Transform(({ value }) => value?.trim())
    @IsEnum(ExamLangType, { message: 'Invalid type' })
    lang_type: ExamLangType;
}

// export class CreateCategoryDbDto extends CreateCategoryDto {
//     slug: Slug;
// }