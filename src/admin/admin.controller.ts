import { Controller, Get, UseGuards, Post, Body, HttpException, HttpStatus, Put, Param, ParseIntPipe } from '@nestjs/common';
import { Roles } from 'src/auth/decorator/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/auth-jwt.guards';
import { RolesGuard } from 'src/auth/guards/role.guards';
import { Category } from 'src/category/category.entity';
import { CategoryService } from 'src/category/category.service';
import { CreateCategoryDto, UpdateCategoryDto } from 'src/category/dto';
import { BaseListFilterDto } from 'src/common/base/base.list';
import { UserRole } from 'src/common/enum/user.enum';
import { ResponseInterface } from 'src/common/interface';
import { CreateExamDto, UpdateExamDto } from 'src/exam/dto';
import { Exam } from 'src/exam/exam.entity';
import { ExamService } from 'src/exam/exam.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles([UserRole.ADMIN])
export class AdminController {
    constructor(
        private readonly categoryService: CategoryService,
        private readonly examService: ExamService
    ) { }

    /**
     * CATEGORY SERVICE
     * @param body 
     * @returns 
     */

    @Post('/category/create')
    async createCategory(@Body() body: CreateCategoryDto): Promise<ResponseInterface<any>> {
        try {
            let { error, data } = await this.categoryService.createCategory(body)
            if (error) {
                throw new HttpException(error, HttpStatus.BAD_REQUEST)
            }
            return {
                code: HttpStatus.OK,
                success: true,
                data
            }
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Put('/category/update/:id')
    async updateCategory(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateCategoryDto): Promise<ResponseInterface<any>> {
        try {
            let { error, data } = await this.categoryService.updateCategory(id, body)
            if (error) {
                throw new HttpException(error, HttpStatus.BAD_REQUEST)
            }
            return {
                code: HttpStatus.OK,
                success: true,
                data
            }
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    @Post('/category/list')
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


    /**
     * EXAM SERVICE
     * @param body 
     * @returns 
     */

    @Post('/exam/create')
    async createExam(@Body() body: CreateExamDto): Promise<ResponseInterface<any>> {
        try {
            let { error, data } = await this.examService.createExam(body)
            if (error) {
                throw new HttpException(error, HttpStatus.BAD_REQUEST)
            }
            return {
                code: HttpStatus.OK,
                success: true,
                data
            }
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Put('/exam/update/:id')
    async updateExam(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateExamDto): Promise<ResponseInterface<any>> {
        try {
            let { error, data } = await this.examService.updateExam(id, body)
            if (error) {
                throw new HttpException(error, HttpStatus.BAD_REQUEST)
            }
            return {
                code: HttpStatus.OK,
                success: true,
                data
            }
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Post('/exam/list')
    async listExam(@Body() body: BaseListFilterDto<any, any>): Promise<ResponseInterface<Exam>> {
        try {
            let { error, data } = await this.examService.getListExam(body)
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
