import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsOptional, IsInt, IsBoolean  } from "class-validator"

export class CreateAnswerDto {
    @ApiProperty()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsInt()
    question_id: number;
    
    @ApiProperty()
    @IsBoolean()
    correct: boolean;

    // @IsOptional()
    // @IsString()
    // @Transform(({ value }) => value?.trim())
    // @IsNotEmpty()
    // recommend: string;
}
