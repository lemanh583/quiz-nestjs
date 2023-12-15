import { Controller, Get, UseGuards, Post, Body, HttpException, HttpStatus, Put, Param, ParseIntPipe, UseInterceptors, UploadedFile, Query, ParseFilePipe, FileTypeValidator, UploadedFiles, UsePipes, Delete } from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/decorator/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/auth-jwt.guards';
import { RolesGuard } from 'src/auth/guards/role.guards';
import { Category } from 'src/category/category.entity';
import { CategoryService } from 'src/category/category.service';
import { CreateCategoryDto, UpdateCategoryDto } from 'src/category/dto';
import { BaseListFilterDto } from 'src/common/base/base.list';
import { UserRole } from 'src/common/enum/user.enum';
import { PayloadTokenInterface, ResponseInterface } from 'src/common/interface';
import { CreateExamDto, UpdateExamDto } from 'src/exam/dto';
import { UploadExamDto } from 'src/exam/dto/upload-exam.dto';
import { Exam } from 'src/exam/exam.entity';
import { ExamService } from 'src/exam/exam.service';
import { ValidateMultiFileSizePipe } from './pipe/validate-uploads.pipe';
import { CurrentUser } from 'src/auth/decorator/user.decorator';
import { QuestionService } from 'src/question/question.service';
import { AddMultipleQuestionDto, CreateQuestionDto, UpdateQuestionDto } from 'src/question/dto';
import { AnswerService } from 'src/answer/answer.service';
import { CreateAnswerDto, UpdateAnswerDto } from 'src/answer/dto';
import { CreateTransactionDto } from 'src/transaction/dto';
import { TransactionService } from 'src/transaction/transaction.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles([UserRole.ADMIN])
export class AdminController {
    constructor(
        private readonly categoryService: CategoryService,
        private readonly examService: ExamService,
        private readonly questionService: QuestionService,
        private readonly answerService: AnswerService,
        private readonly transactionService: TransactionService
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
    async createExam(@Body() body: CreateExamDto, @CurrentUser() user: PayloadTokenInterface): Promise<ResponseInterface<any>> {
        try {
            let { error, data } = await this.examService.createExam(body, user)
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
            console.log(error)
            if (error instanceof HttpException) throw error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Post('/exam/upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadExam(@Body() body: UploadExamDto, @CurrentUser() user: PayloadTokenInterface, @UploadedFile(
        new ParseFilePipe({
            validators: [
                new FileTypeValidator({ fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
            ],
        }),
    ) file: Express.Multer.File) {
        try {
            let { error, data } = await this.examService.handleUploadExcel(file, body, user)
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

    // @Post('/exam/auto-generate')
    // async autoGenerate(@Body() body: BaseListFilterDto<any, any>): Promise<ResponseInterface<Exam>> {
    //     try {
    //         let { error, data } = await this.examService.getListExam(body)
    //         if (error) {
    //             throw new HttpException(error, HttpStatus.BAD_REQUEST)
    //         }
    //         return {
    //             code: HttpStatus.OK,
    //             success: true,
    //             ...data
    //         }
    //     } catch (error) {
    //         if (error instanceof HttpException) throw error
    //         throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }



    /**
     * MEDIA SERVICE
     * @param body 
     * @returns 
     */


    @Post('/upload')
    @UseInterceptors(FilesInterceptor('files'))
    @UsePipes(ValidateMultiFileSizePipe)
    uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
        // console.log(files);
    }



    /**
    * QUESTION SERVICE
    * @param body 
    * @returns 
    */

    @Post('/question/list')
    async listQuestion(@Body() body: BaseListFilterDto<any, any>): Promise<ResponseInterface<any>> {
        try {
            let { error, data } = await this.questionService.listQuestion(body)
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

    @Post('/question/create')
    async createQuestion(@Body() body: CreateQuestionDto): Promise<ResponseInterface<any>> {
        try {
            let { error, data } = await this.questionService.createQuestion(body)
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

    @Post('/question/update/:question_id')
    async updateQuestion(@Param("question_id", ParseIntPipe) question_id: number, @Body() body: UpdateQuestionDto): Promise<ResponseInterface<any>> {
        try {
            let { error, data } = await this.questionService.updateQuestion(question_id, body)
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

    @Post('/question/add-multiple-question/:exam_id')
    async addMultipleQuestion(@Param("exam_id", ParseIntPipe) exam_id: number, @Body() body: AddMultipleQuestionDto): Promise<ResponseInterface<any>> {
        try {
            let { error, data } = await this.questionService.addMultipleQuestion(exam_id, body)
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

    @Delete('/question/delete/:question_id')
    async deleteQuestion(@Param("question_id", ParseIntPipe) question_id: number): Promise<ResponseInterface<any>> {
        try {
            let { error, data } = await this.questionService.deleteQuestion(question_id)
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
   * ANSWER SERVICE
   * @param body 
   * @returns 
   */
    @Post('/answer/create')
    async createAnswer(@Body() body: CreateAnswerDto): Promise<ResponseInterface<any>> {
        try {
            let { error, data } = await this.answerService.createAnswer(body)
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


    @Post('/answer/update/:answer_id')
    async updateAnswer(@Param("answer_id", ParseIntPipe) answer_id: number, @Body() body: UpdateAnswerDto): Promise<ResponseInterface<any>> {
        try {
            let { error, data } = await this.answerService.updateAnswer(answer_id, body)
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


    /**
    * TRANSACTION SERVICE
    * @param body 
    * @returns 
    */
    @Post('/transaction/create')
    async createTransaction(@Body() body: CreateTransactionDto): Promise<ResponseInterface<any>> {
        try {
            let { error, data } = await this.transactionService.createTransaction(body)
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


    @Post('/transaction/list')
    async listTransaction(@Body() body: BaseListFilterDto<any, any>): Promise<ResponseInterface<any>> {
        try {
            let { error, data } = await this.transactionService.getListTransaction(body)
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
