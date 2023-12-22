import { ApiProperty } from "@nestjs/swagger";
import {IsInt, IsOptional  } from "class-validator"

export class UpdateTransactionDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    user_id: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    package_id: number;
    
    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    price: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    category_id: number;
}
