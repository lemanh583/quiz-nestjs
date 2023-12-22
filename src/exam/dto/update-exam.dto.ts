import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDate, Min, IsInt, IsArray, ArrayUnique, ArrayNotEmpty  } from "class-validator"
import { ExamLangType, ExamType } from "src/common/enum/exam.enum";

export class UpdateExamDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    title: string;

    @ApiProperty({  required: false })
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsInt({ each: true })
    category_ids: number[]

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDate()
    time_start: Date

    @ApiProperty({  required: false })
    @IsOptional()
    @IsDate()
    time_end: Date

    // @ApiProperty({  required: false })
    // @IsOptional()
    // @IsInt()
    // @Min(0)
    // total_generate_question: number

    @ApiProperty({  required: false, enum: ExamLangType })
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    @IsEnum(ExamLangType, { message: 'Invalid type' })
    lang_type: ExamLangType;
}
