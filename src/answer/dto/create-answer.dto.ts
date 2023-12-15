import { Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsOptional, IsInt, IsBoolean  } from "class-validator"

export class CreateAnswerDto {
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    title: string;

    @IsInt()
    question_id: number;

    @IsBoolean()
    correct: boolean;

    // @IsOptional()
    // @IsString()
    // @Transform(({ value }) => value?.trim())
    // @IsNotEmpty()
    // recommend: string;
}
