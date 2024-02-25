import { Controller, Get, HttpException, HttpStatus, Param, Post, Req, Query, Body, ParseIntPipe } from '@nestjs/common';
import { SlugService } from './slug.service';
import { MessageError } from 'src/common/enum/error.enum';
import { SlugType } from 'src/common/enum/slug.enum';
import { CategoryService } from 'src/category/category.service';
import { CategoryType } from 'src/common/enum/category.enum';
import { ExamService } from 'src/exam/exam.service';
import { CurrentUser } from 'src/auth/decorator/user.decorator';
import { PayloadTokenInterface, ResponseInterface } from 'src/common/interface';
import { TransactionService } from 'src/transaction/transaction.service';
import { PostService } from 'src/post/post.service';
import { TopicService } from 'src/topic/topic.service';
import { TopicType } from 'src/common/enum/topic.enum';
import { BaseListFilterDto } from 'src/common/base/base.list';
import { ExamHistoryService } from 'src/exam-history/exam-history.service';
import { Exam } from 'src/exam/exam.entity';
import { ExamLangType } from 'src/common/enum/exam.enum';
import { UserService } from 'src/user/user.service';
import { UserRole } from 'src/common/enum/user.enum';
import { ExamEndDto } from 'src/exam/dto';

@Controller('')
export class SlugController {
    constructor(
        private readonly slugService: SlugService,
        private readonly categoryService: CategoryService,
        private readonly examService: ExamService,
        private readonly transactionService: TransactionService,
        private readonly postService: PostService,
        private readonly topicService: TopicService,
        private readonly examHistoryService: ExamHistoryService,
        private readonly userService: UserService
    ) { }

    // @Get('/test')
    // async test() {
    //     try {
    //         let slugDB = await this.slugService.test();
    //         return {
    //             code: HttpStatus.OK,
    //             success: true,
    //             data: slugDB
    //         }
    //     } catch (error) {
    //         if (error instanceof HttpException) throw error
    //         throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }

    @Post('/list-rank')
    async listRank(@Body() body: any): Promise<any> {
        try {
            let { error, data } = await this.examHistoryService.getListRank(body)
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

    @Get('/:slug')
    async getDataFromSlug(@Req() request: Request, @Param('slug') slug: string, @Query() query: any) {
        try {
            const user: PayloadTokenInterface = request['user'];
            let slug_db = await this.slugService.findOne({ where: { slug: slug } });
            if (!slug_db) {
                throw new HttpException(MessageError.ERROR_NOT_FOUND, HttpStatus.BAD_REQUEST)
            }
            let rs: any
            switch (slug_db.type) {
                case SlugType.topic:
                    let topic = await this.topicService.findOne({
                        where: { slug: { slug } },
                        relations: { slug: true }
                    })
                    if (!topic) {
                        throw new HttpException(MessageError.ERROR_NOT_FOUND, HttpStatus.BAD_REQUEST)
                    }
                    // trả về danh sách bài viết của topic đó
                    if (topic.type == TopicType.post) {
                        let payload: BaseListFilterDto<any, any> = {}
                        if (query.limit) {
                            payload.limit = Number(query.limit) && Number(query.limit) > 0 ? Number(query.limit) : 0
                        }
                        if (query.page) {
                            payload.page = Number(query.page) && Number(query.limit) > 0 ? Number(query.page) : 1
                        }
                        if (query.search) {
                            payload.search = query.search
                        }
                        let rs_posts = await this.postService.listPost(payload)
                        if (rs_posts.error) {
                            throw new HttpException(rs_posts.error, HttpStatus.BAD_REQUEST)
                        }
                        rs = { ...rs_posts.data, type: 'posts' }
                    }
                    // Nếu là exam thì trả về thông tin của topic
                    if (topic.type == TopicType.exam) {
                        let access_topic = await this.topicService.isAccessTopic(topic, user)
                        rs = { data: { ...topic, ...access_topic }, type: "exam" }
                    }
                    break;
                case SlugType.post:
                    let post = await this.postService.findOne({ where: { slug: { slug } }, relations: { slug: true } })
                    if (!post) {
                        throw new HttpException(MessageError.ERROR_NOT_FOUND, HttpStatus.BAD_REQUEST)
                    }
                    // update view
                    await this.postService.updateOne({ id: post.id }, { view: post.view + 1 })
                    rs = { data: post, type: 'post' }
                    break;
                default:
                    break
            }
            return {
                code: HttpStatus.OK,
                success: true,
                ...rs
            }
        } catch (error) {
            console.error(error);
            if (error instanceof HttpException) throw error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get('/free/auto-generate/:slug')
    async autoGenerateFromSlug(@Param("slug") slug: string): Promise<ResponseInterface<Exam>> {
        try {
            let topic = await this.topicService.findOne({ where: { slug: { slug } } })
            if (!topic) {
                throw new HttpException(MessageError.ERROR_NOT_FOUND, HttpStatus.BAD_REQUEST)
            }
            let rs = await this.examService.getExamWithConditionTotalQuestion(topic.id, topic.lang_type == ExamLangType.en ? 15 : 30)
            if (!rs.data) {
                let user = await this.userService.findOne({ where: { role: UserRole.ADMIN }})
                if (!user) {
                    throw new HttpException(MessageError.ERROR_NOT_FOUND, HttpStatus.BAD_REQUEST)
                }
                let { error, data } = await this.examService.calculateCategoryFromSlug(slug, user, { is_access_topic: true, is_free: true })
                if (error) {
                    throw new HttpException(error, HttpStatus.BAD_REQUEST)
                }
                return {
                    code: HttpStatus.OK,
                    success: true,
                    ...data
                }
            }

            return {
                code: HttpStatus.OK,
                success: true,
                exam: rs.data,
                failed_category_ids: []
            }
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Post('/free/:exam_id/start')
    async startExam(@Body() body: any, @Param("exam_id", ParseIntPipe) exam_id: number): Promise<any> {
        try {
            let { error, data } = await this.examService.startExamForFree(exam_id, body)
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

    @Post('/free/:exam_id/end')
    async endExam(@Body() body: ExamEndDto, @Param("exam_id", ParseIntPipe) exam_id: number): Promise<any> {
        try {
            let { error, data } = await this.examService.endExamForFree(exam_id, body)
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



}
