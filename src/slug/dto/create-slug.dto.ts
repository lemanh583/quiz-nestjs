import { SlugType } from "src/common/enum/slug.enum";

export class CreateSlugDto {
    type: SlugType;
    slug: string;
}