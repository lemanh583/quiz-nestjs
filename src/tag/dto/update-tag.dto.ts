import { Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsOptional } from "class-validator"
import { ApiProperty } from "@nestjs/swagger";

export class UpdateTagDto {
    @ApiProperty({ description: "Không được quá dài", required: false })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    title: string;
}
