import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDate, Min, IsInt } from "class-validator"
import { ExamLangType, ExamType } from "src/common/enum/exam.enum";

export class CreateExamDto {
    @ApiProperty()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: "id của thể loại" })
    @IsInt()
    category_id: number

    @ApiProperty({ required: false, description: "Ngày bắt đầu bài thi -- optional" })
    @IsOptional()
    @IsDate()
    time_start: Date

    @ApiProperty({ required: false, description: "Ngày kết thúc bài thi -- optional" })
    @IsOptional()
    @IsDate()
    time_end: Date

    // @ApiProperty({ required: false, description: "Số lượng câu hỏi tự động generate -- optional - mặc định 60" })
    // @IsOptional()
    // @IsInt()
    // @Min(0)
    // total_generate_question: number

    @ApiProperty({ required: false, description: "Bài thi tiếng anh -- optional" })
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    @IsEnum(ExamLangType, { message: 'Invalid type' })
    lang_type: ExamLangType;
}
