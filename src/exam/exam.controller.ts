import { Response, Body, Controller, HttpException, HttpStatus, Param, Post, UploadedFile, UseGuards, UseInterceptors, ParseIntPipe, Get, Query } from '@nestjs/common';
import { ExamService } from './exam.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { BaseListFilterDto } from 'src/common/base/base.list';
import { PayloadTokenInterface, ResponseInterface } from 'src/common/interface';
import { Exam } from './exam.entity';
import { JwtAuthGuard } from 'src/auth/guards/auth-jwt.guards';
import { CurrentUser } from 'src/auth/decorator/user.decorator';
import { ExamAutoGenerateDto, ExamEndDto, UpdateLogExamDto } from './dto';
import { Response as Res } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TopicService } from 'src/topic/topic.service';
import { MessageError } from 'src/common/enum/error.enum';
import { ExamHistoryService } from 'src/exam-history/exam-history.service';

@ApiBearerAuth()
@Controller('exam')
@UseGuards(JwtAuthGuard)
export class ExamController {
    constructor(
        private readonly examService: ExamService,
        private readonly topicService: TopicService,
        private readonly examHistoryService: ExamHistoryService
    ) { }

    // @Post('/auto-generate')
    // async autoGenerate(@Body() body: ExamAutoGenerateDto, @CurrentUser() user: PayloadTokenInterface): Promise<ResponseInterface<Exam>> {
    //     try {
    //         let { error, data } = await this.examService.autoGenerateExam(user, body)
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


    @Get('/auto-generate/:slug')
    async autoGenerateFromSlug(@Param("slug") slug: string, @CurrentUser() user: PayloadTokenInterface): Promise<ResponseInterface<Exam>> {
        try {
            let topic = await this.topicService.findOne({ where: { slug: { slug } } })
            if (!topic) {
                throw new HttpException(MessageError.ERROR_NOT_FOUND, HttpStatus.BAD_REQUEST)
            }
            let isAccessTopic = await this.topicService.isAccessTopic(topic, user)
            if (!isAccessTopic) {
                throw new HttpException(MessageError.ERROR_ACCESS_DENIED, HttpStatus.BAD_REQUEST)
            }
            let { error, data } = await this.examService.calculateCategoryFromSlug(slug, user)
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

    @Post('/:exam_id/start')
    async startExam(@Body() body: any, @Param("exam_id", ParseIntPipe) exam_id: number, @CurrentUser() user: PayloadTokenInterface): Promise<any> {
        try {
            let { error, data } = await this.examService.startExam(exam_id, user, body)
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

    @Post('/:exam_id/end')
    async endExam(@Body() body: ExamEndDto, @Param("exam_id", ParseIntPipe) exam_id: number, @CurrentUser() user: PayloadTokenInterface, @Query() query: any): Promise<any> {
        try {
            let { error, data } = await this.examService.endExam(exam_id, user, body)
            if (error) {
                throw new HttpException(error, HttpStatus.BAD_REQUEST)
            }
            let result = await this.examHistoryService.detailHistory(data.id, user.id, query || {})
            if (result.error) {
                throw new HttpException(result.error, HttpStatus.BAD_REQUEST)
            }
            return {
                code: HttpStatus.OK,
                success: true,
                ...result.data
            }
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Post('/update-log/:exam_id')
    async updateLogExam(@Param("exam_id", ParseIntPipe) exam_id: number, @Body() body: UpdateLogExamDto, @CurrentUser() user: PayloadTokenInterface): Promise<any> {
        try {
            let { error, data } = await this.examService.updateLog(exam_id, body, user)
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

    @Get('/get-exam-for-user/:slug')
    async getExamForUserWithSlug(@Param("slug") slug: string, @CurrentUser() user: PayloadTokenInterface, @Query() query: any): Promise<ResponseInterface<Exam>> {
        try {
            let topic = await this.topicService.findOne({ where: { slug: { slug } } })
            if (!topic) {
                throw new HttpException(MessageError.ERROR_NOT_FOUND, HttpStatus.BAD_REQUEST)
            }
            let payload: BaseListFilterDto<any, any> = {}
            if (query.limit) {
                payload.limit = Number(query.limit) && Number(query.limit) > 0 ? Number(query.limit) : 0
            }
            if (query.page) {
                payload.page = Number(query.page) && Number(query.limit) > 0 ? Number(query.page) : 1
            }
            payload.filter.user_ids = [user.id]
            payload.filter.topic_ids = [topic.id]
            let { error, data } = await this.examService.getListExam(payload)
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
