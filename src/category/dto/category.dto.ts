import { Expose, Type } from "class-transformer";
import { BaseDto } from "src/common/base/base.dto";
import { CategoryType } from "src/common/enum/category.enum";
import { ExamType } from "src/common/enum/exam.enum";
import { SlugType } from "src/common/enum/slug.enum";
import { Slug } from "src/slug/slug.entity";

class CategorySlugDto {
    @Expose()
    id: number;
    @Expose()
    type: string;
    @Expose()
    slug: string;   
}
export class CategoryDto extends BaseDto {
    @Expose()
    title: string;

    @Expose()
    type: CategoryType;

    @Expose()
    lang_type: ExamType;

    @Expose()
    @Type(() => CategorySlugDto)
    slug: CategorySlugDto
}



