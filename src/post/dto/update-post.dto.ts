import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDate, Min, IsInt } from "class-validator"
import { PostPosition } from "src/common/enum/post.enum";

export class UpdatePostDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    title: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    category_id: number

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    descriptions: string;

    @ApiProperty({ required: false, enum: PostPosition })
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    @IsEnum(PostPosition, { message: 'Invalid position' })
    position?: PostPosition;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    content: string;
}
