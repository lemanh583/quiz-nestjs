import { Expose, Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDate, Min, IsInt  } from "class-validator"
import { PostPosition } from "src/common/enum/post.enum";

export class UpdatePostDto {
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsInt()
    category_id: number

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    descriptions: string;

    @IsOptional()
    @Transform(({ value }) => value?.trim())
    @IsEnum(PostPosition, { message: 'Invalid position' })
    position?: PostPosition;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    content: string;
}
