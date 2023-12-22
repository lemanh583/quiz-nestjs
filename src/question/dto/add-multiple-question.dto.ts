import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, ArrayNotEmpty, ValidateNested, IsString, IsNotEmpty, IsBoolean, IsOptional, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validate } from "class-validator"

@ValidatorConstraint()
class validateAnswerElement implements ValidatorConstraintInterface {
  validate(answers: AnswerElementQuestionElementAddMultipleDto[], validationArguments: ValidationArguments) {
    let correctAnswerMap = answers.filter((item) => item.correct)
    if (correctAnswerMap.length != 1) return false
    return true
  }
}

export class AnswerElementQuestionElementAddMultipleDto {
  @ApiProperty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsBoolean()
  correct: boolean
}

export class QuestionElementAddMultipleDto {
  @ApiProperty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  recommend: string

  @ApiProperty({ description: "Mảng câu trả lời phải có 1 đáp án đúng" })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AnswerElementQuestionElementAddMultipleDto)
  @Validate(validateAnswerElement, { message: "The question no correct answer element" })
  answers: AnswerElementQuestionElementAddMultipleDto[]
}


export class AddMultipleQuestionDto {
  @ApiProperty({ description: "Mảng câu hỏi và câu trả lời" })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => QuestionElementAddMultipleDto)
  questions: QuestionElementAddMultipleDto[];
}