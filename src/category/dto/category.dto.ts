import { BaseDto } from "src/common/base/base.dto";
import { CategoryType } from "src/common/enum/category.enum";
import { Slug } from "src/slug/slug.entity";

export class CategoryDto extends BaseDto {
    title: string;
    type: CategoryType;
    slug: string
    slug_id: string
}