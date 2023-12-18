import { Expose, Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDate, Min, IsInt  } from "class-validator"
import { ExamLangType, ExamType } from "src/common/enum/exam.enum";
import { PostPosition } from "src/common/enum/post.enum";

export class CreatePostDto {
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    title: string;

    @IsInt()
    category_id: number

    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    descriptions: string;

    @IsOptional()
    @Transform(({ value }) => value?.trim())
    @IsEnum(PostPosition, { message: 'Invalid position' })
    position?: PostPosition;

    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    content: string;
}
