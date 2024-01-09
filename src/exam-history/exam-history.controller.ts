import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/auth-jwt.guards';
import { ExamHistoryService } from './exam-history.service';
import { CurrentUser } from 'src/auth/decorator/user.decorator';
import { PayloadTokenInterface } from 'src/common/interface';
import { BaseListFilterDto } from 'src/common/base/base.list';

@Controller('exam-history')
@UseGuards(JwtAuthGuard)
export class ExamHistoryController {
    constructor(private readonly examHistoryService: ExamHistoryService) { }

    @Get('/list/:exam_id')
    async listHistoryForExam(@Param("exam_id", ParseIntPipe) exam_id: number, @CurrentUser() user: PayloadTokenInterface, @Query() query: any): Promise<any> {
        try {
            let { error, data } = await this.examHistoryService.getListHistory(exam_id, user.id, query)
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

    @Get('/get/:history_id')
    async detailHistory(@Param("history_id", ParseIntPipe) history_id: number, @CurrentUser() user: PayloadTokenInterface, @Query() query: any): Promise<any> {
        try {
            let { error, data } = await this.examHistoryService.detailHistory(history_id, user.id, query)
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

    @Get('/list-for-topic/:slug')
    async listHistoryForTopic(@Param("slug") slug: string, @CurrentUser() user: PayloadTokenInterface, @Query() query: any): Promise<any> {
        try {
            let { error, data } = await this.examHistoryService.getListHistoryForTopic(slug, user, query)
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

    @Post('/list-all-for-user')
    async listAllHistoryForUser(@CurrentUser() user: PayloadTokenInterface, @Body() body: BaseListFilterDto<any, any>): Promise<any> {
        try {
            let { error, data } = await this.examHistoryService.getAllListHistoryForUser(user, body)
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
