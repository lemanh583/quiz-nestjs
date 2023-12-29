import { Controller, Get, HttpException, HttpStatus, Param, Headers, Req, Query } from '@nestjs/common';
import { SlugService } from './slug.service';
import { MessageError } from 'src/common/enum/error.enum';
import { SlugType } from 'src/common/enum/slug.enum';
import { CategoryService } from 'src/category/category.service';
import { CategoryType } from 'src/common/enum/category.enum';
import { ExamService } from 'src/exam/exam.service';
import { CurrentUser } from 'src/auth/decorator/user.decorator';
import { PayloadTokenInterface } from 'src/common/interface';
import { TransactionService } from 'src/transaction/transaction.service';
import { PostService } from 'src/post/post.service';
import { TopicService } from 'src/topic/topic.service';
import { TopicType } from 'src/common/enum/topic.enum';
import { BaseListFilterDto } from 'src/common/base/base.list';

@Controller('')
export class SlugController {
    constructor(
        private readonly slugService: SlugService,
        private readonly categoryService: CategoryService,
        private readonly examService: ExamService,
        private readonly transactionService: TransactionService,
        private readonly postService: PostService,
        private readonly topicService: TopicService,
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
                        rs = { ...rs_posts.data }
                    }
                    // Nếu là exam thì trả về thông tin của topic
                    if (topic.type == TopicType.exam) {
                        let is_access_topic = await this.topicService.isAccessTopic(topic, user)
                        rs = { data: { ...topic, is_access_topic } }
                    }
                    break;
                case SlugType.post:
                    let post = await this.postService.findOne({ where: { slug: { slug } } })
                    if (!post) {
                        throw new HttpException(MessageError.ERROR_NOT_FOUND, HttpStatus.BAD_REQUEST)
                    }
                    // update view
                    await this.postService.updateOne({ id: post.id }, { view: post.view + 1 })
                    rs = { data: post }
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
}
