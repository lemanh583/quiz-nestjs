import { Expose, Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray, IsNumber, IsInt  } from "class-validator"
import { ExamLangType } from "src/common/enum/exam.enum";
import { ApiProperty } from "@nestjs/swagger";
import { TopicType } from "src/common/enum/topic.enum";

export class CreateTopicDto {
    @ApiProperty({ description: "Không được quá dài" })
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: "Category cho bài thi thì là exam. Cho post thì là post",
        enum: TopicType,
    })
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    @IsEnum(TopicType, { message: 'Invalid type' })
    type: TopicType;

    @ApiProperty({
        required: false, 
        enum: ExamLangType,
        description: "Cái ni là optional. Đối với category viết anh thì set lại là en. Mặc định vi", 
    })
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    @IsEnum(ExamLangType, { message: 'Invalid type' })
    lang_type?: ExamLangType;


    @ApiProperty({ description: "image url", required: false })
    @IsOptional()
    @IsString()
    img?: string

    @ApiProperty({ description: "description", required: false })
    @IsOptional()
    @IsString()
    description?: string

    @ApiProperty({ description: "category_ids", required: false })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    category_ids?: number[]
}
