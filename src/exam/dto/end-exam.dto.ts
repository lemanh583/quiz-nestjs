import { Type } from "class-transformer";
import { IsInt, IsArray, ArrayNotEmpty, IsOptional, IsEnum, Min, Max, ArrayMinSize, ValidateNested, Validate, ValidationArguments, ValidatorConstraintInterface, ValidatorConstraint } from "class-validator"
import { ExamLangType } from "src/common/enum/exam.enum";

export class ElementExamEnd {
    @IsInt()
    @Min(0)
    question_id: number

    @IsInt()
    @Min(0)
    answer_id: number
}


// @ValidatorConstraint()
// class validatePercentSum implements ValidatorConstraintInterface {
//   validate(categories: CategoriesElementAutoGenerate[], validationArguments: ValidationArguments) {
//     const sum = categories?.reduce((total, category) => total + category.percent, 0);
//     if (sum > 100) return false
//     return true
//   }
// }

export class ExamEndDto {
    @IsArray()
    @ArrayNotEmpty()
    // @ArrayMinSize(3)
    @ValidateNested({ each: true })
    @Type(() => ElementExamEnd)
    form: ElementExamEnd[];
}


