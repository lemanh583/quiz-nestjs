import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDate, Min, IsInt, IsArray } from "class-validator"
import { ExamLangType, ExamType } from "src/common/enum/exam.enum";
import { PostPosition } from "src/common/enum/post.enum";

export class CreatePostDto {
    @ApiProperty()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsInt()
    topic_id: number

    @ApiProperty()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    descriptions: string;

    @ApiProperty()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    content: string;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    tag_ids: number[]
}
