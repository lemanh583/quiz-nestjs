import { Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsOptional, IsInt  } from "class-validator"

export class UpdateQuestionDto {
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    recommend: string;
}
