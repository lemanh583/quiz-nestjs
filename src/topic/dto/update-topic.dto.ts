import { Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsBoolean } from "class-validator"
import { ApiProperty } from "@nestjs/swagger";
import { ExamLangType } from "src/common/enum/exam.enum";
import { TopicType } from "src/common/enum/topic.enum";

export class UpdateTopicDto {
    @ApiProperty({ description: "Không được quá dài", required: false })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: "category type", required: false, enum: TopicType })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    @IsEnum(TopicType, { message: 'Invalid type' })
    type: TopicType;


    @ApiProperty({ description: "lang type", required: false, enum: ExamLangType })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    @IsEnum(ExamLangType, { message: 'Invalid type' })
    lang_type: ExamLangType;

    @ApiProperty({ description: "hidden", required: false })
    @IsOptional()
    @IsBoolean()
    hidden: boolean;

    @ApiProperty({ description: "image url", required: false })
    @IsOptional()
    @IsString()
    img?: string

    @ApiProperty({ description: "description", required: false })
    @IsOptional()
    @IsString()
    description?: string
}
