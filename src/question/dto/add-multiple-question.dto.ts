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
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    title: string;

    @IsBoolean()
    correct: boolean
}

export class QuestionElementAddMultipleDto {
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @Transform(({ value }) => value?.trim())
    recommend: string

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => AnswerElementQuestionElementAddMultipleDto)
    @Validate(validateAnswerElement, { message: "The question no correct answer element"})
    answers: AnswerElementQuestionElementAddMultipleDto[]
}


export class AddMultipleQuestionDto {
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => QuestionElementAddMultipleDto)
    questions: QuestionElementAddMultipleDto[];
}