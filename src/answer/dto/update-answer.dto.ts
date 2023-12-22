import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsOptional, IsInt, IsBoolean  } from "class-validator"

export class UpdateAnswerDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    title: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    correct: boolean;
}
