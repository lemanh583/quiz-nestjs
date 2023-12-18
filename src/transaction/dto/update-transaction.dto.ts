import {IsInt, IsOptional  } from "class-validator"

export class UpdateTransactionDto {
    @IsOptional()
    @IsInt()
    user_id: number;

    @IsOptional()
    @IsInt()
    package_id: number;

    @IsOptional()
    @IsInt()
    price: number;

    @IsOptional()
    @IsInt()
    category_id: number;
}
