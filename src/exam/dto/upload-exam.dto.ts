import { Transform } from "class-transformer";
import { IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { ExamLangType, uploadExamType } from "src/common/enum/exam.enum";

export class UploadExamDto {
    @Transform(value => Number.isNaN(+value) ? 0 :  value)
    @IsInt()
    @Min(0)
    category_id: number;

    @IsOptional()
    @Transform(value => Number.isNaN(+value) ? 0 : +value)
    @IsInt()
    @Min(0)
    exam_id: number;

    @IsOptional()
    @IsEnum(ExamLangType, { message: "Invalid type" })
    lang_type: ExamLangType

    // @IsEnum(uploadExamType, { message: 'Invalid type' })
    // type: uploadExamType;
}

