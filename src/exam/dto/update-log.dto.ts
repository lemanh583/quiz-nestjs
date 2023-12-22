import { ApiProperty } from "@nestjs/swagger"
import { IsInt, IsOptional, IsString, Min } from "class-validator"

export class UpdateLogExamDto {
    @ApiProperty()
    @IsInt()
    @Min(0)
    question_id: number

    @ApiProperty()
    @IsInt()
    @Min(0)
    answer_id: number
}