import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDate, Min, IsInt } from "class-validator"
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
    category_id: number

    @ApiProperty()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    descriptions: string;

    @ApiProperty({ required: false, enum: PostPosition, description: "Vị trí của post nếu set: left, right, center" })
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    @IsEnum(PostPosition, { message: 'Invalid position' })
    position?: PostPosition;

    @ApiProperty()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    content: string;
}
