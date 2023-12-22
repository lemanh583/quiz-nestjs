import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { ExamLangType, uploadExamType } from "src/common/enum/exam.enum";

export class UploadExamDto {
    @ApiProperty({})
    @Transform(value => Number.isNaN(+value) ? 0 : value)
    @IsInt()
    @Min(0)
    category_id: number;

    @ApiProperty({ required: false, description: "Cái này upload câu hỏi cho 1 bài thi, nếu không có thì là upload nhiều bài thi cho 1 catêgory" })
    @IsOptional()
    @Transform(value => Number.isNaN(+value) ? 0 : +value)
    @IsInt()
    @Min(0)
    exam_id: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEnum(ExamLangType, { message: "Invalid type" })
    lang_type: ExamLangType

    // @IsEnum(uploadExamType, { message: 'Invalid type' })
    // type: uploadExamType;
}

