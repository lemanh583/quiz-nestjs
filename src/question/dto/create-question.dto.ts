import { Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsOptional, IsInt  } from "class-validator"

export class CreateQuestionDto {
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    title: string;

    @IsInt()
    exam_id: number;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    recommend: string;
}
