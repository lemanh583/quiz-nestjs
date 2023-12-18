import { Transform } from "class-transformer";
import { IsEnum, IsOptional, IsInt  } from "class-validator"
import { MediaType } from "src/common/enum/media.enum";

export class CreateMediaDto {
    @IsOptional()
    @IsInt()
    ref_id: number;

    @Transform(({ value }) => value?.trim())
    @IsEnum(MediaType, { message: 'Invalid type' })
    ref_type: MediaType;
}
