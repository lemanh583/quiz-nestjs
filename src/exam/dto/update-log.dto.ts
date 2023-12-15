import { IsInt, IsOptional, IsString, Min } from "class-validator"

export class UpdateLogExamDto {
    @IsInt()
    @Min(0)
    question_id: number

    @IsInt()
    @Min(0)
    answer_id: number
}