import { Transform } from "class-transformer";
import { IsString, IsNotEmpty } from "class-validator"
import { ApiProperty } from "@nestjs/swagger";

export class CreateTagDto {
    @ApiProperty({ description: "Không được quá dài" })
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    title: string;
}
