import { Type } from "class-transformer";
import { IsInt, IsArray, ArrayNotEmpty, IsOptional, IsEnum, Min, Max, ArrayMinSize, ValidateNested, Validate, ValidationArguments, ValidatorConstraintInterface, ValidatorConstraint } from "class-validator"
import { ExamLangType } from "src/common/enum/exam.enum";

export class CategoriesElementAutoGenerate {
    @IsInt()
    @Min(1)
    @Max(100)
    percent: number

    @IsInt()
    @Min(0)
    category_id: number
}


@ValidatorConstraint()
class validatePercentSum implements ValidatorConstraintInterface {
  validate(categories: CategoriesElementAutoGenerate[], validationArguments: ValidationArguments) {
    const sum = categories?.reduce((total, category) => total + category.percent, 0);
    if (sum > 100) return false
    return true
  }
}

export class ExamAutoGenerateDto {
    @IsArray()
    @ArrayNotEmpty()
    // @ArrayMinSize(3)
    @ValidateNested({ each: true })
    @Type(() => CategoriesElementAutoGenerate)
    @Validate(validatePercentSum, { message: "The sum of percent values must be equal to 100%"})
    categories: CategoriesElementAutoGenerate[];

    @IsOptional()
    @IsEnum({ enum: ExamLangType })
    lang_type: ExamLangType

    @IsOptional()
    @IsInt()
    @Min(30)
    total_questions: number
}


