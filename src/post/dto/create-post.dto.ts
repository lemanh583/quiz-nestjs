import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsOptional, IsInt, IsArray } from "class-validator"

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
    description: string;

    @ApiProperty()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    content: string;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    tag_ids?: number[]

    @ApiProperty()
    @IsOptional()
    @IsString()
    img?: string
}
