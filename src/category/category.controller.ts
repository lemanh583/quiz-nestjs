import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ResponseInterface } from 'src/common/interface';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { BaseListFilterDto } from 'src/common/base/base.list';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    // @Post()
    // async createCategory(@Body() body: CreateCategoryDto): Promise<ResponseInterface<any>> {
    //     try {
    //         let { error, data, token } = await this.categoryService.createCategory(body)
    //         if (error) {
    //             throw new HttpException(error, HttpStatus.BAD_REQUEST)
    //         }
    //         return {
    //             code: HttpStatus.OK,
    //             success: true,
    //             data: {
    //                 user: data, token
    //             }
    //         }
    //     } catch (error) {
    //         if (error instanceof HttpException) throw error
    //         throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }

    @Post('/list')
    async listCategory(@Body() body: BaseListFilterDto<any, any>): Promise<ResponseInterface<Category>> {
        try {
            let { error, data } = await this.categoryService.getListCategory(body)
            if (error) {
                throw new HttpException(error, HttpStatus.BAD_REQUEST)
            }
            return {
                code: HttpStatus.OK,
                success: true,
                ...data
            }
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
