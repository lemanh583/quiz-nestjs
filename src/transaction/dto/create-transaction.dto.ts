import {IsInt, IsArray  } from "class-validator"

export class CreateTransactionDto {
    @IsInt()
    user_id: number;

    @IsInt()
    package_id: number;

    @IsInt()
    price: number;

    @IsArray()
    @IsInt({ each: true })
    category_ids: number[];
}
