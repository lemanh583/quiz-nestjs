import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional, IsInt  } from "class-validator"
import { MediaType } from "src/common/enum/media.enum";

export class CreateMediaDto {
    @ApiProperty({ required: false, description: "Cái này là id của exam hoặc category" })
    @IsOptional()
    @IsInt()
    ref_id: number;

    @ApiProperty({ description: "Cái ni là loại của media", enum: MediaType })
    @Transform(({ value }) => value?.trim())
    @IsEnum(MediaType, { message: 'Invalid type' })
    ref_type: MediaType;
}
