import { ApiProperty } from "@nestjs/swagger";
import {IsInt, IsArray  } from "class-validator"

export class CreateTransactionDto {
    @ApiProperty()
    @IsInt()
    user_id: number;

    @ApiProperty()
    @IsInt()
    package_id: number;

    @ApiProperty()
    @IsInt()
    price: number;

    @ApiProperty()
    @IsArray()
    @IsInt({ each: true })
    category_ids: number[];
}
