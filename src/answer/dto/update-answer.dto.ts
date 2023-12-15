import { Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsOptional, IsInt, IsBoolean  } from "class-validator"

export class UpdateAnswerDto {
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsBoolean()
    correct: boolean;
}
