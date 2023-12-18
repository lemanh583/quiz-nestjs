import { Controller, Get, HttpException, HttpStatus, Param, Headers, Req } from '@nestjs/common';
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

@Controller('')
export class SlugController {
    constructor(
        private readonly slugService: SlugService,
        private readonly categoryService: CategoryService,
        private readonly examService: ExamService,
        private readonly transactionService: TransactionService,
        private readonly postService: PostService,
    ) { }

    @Get('/test')
    async test() {
        try {
            let slugDB = await this.slugService.test();
            return {
                code: HttpStatus.OK,
                success: true,
                data: slugDB
            }
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get('/:slug')
    async getDataFromSlug(@Req() request: Request, @Param('slug') slug: string, body: any) {
        try {
            const user: PayloadTokenInterface = request['user'];
            let slug_db = await this.slugService.findOne({ where: { slug: slug } });
            if (!slug_db) {
                throw new HttpException(MessageError.ERROR_NOT_FOUND, HttpStatus.BAD_REQUEST)
            }
            let rs: any
            switch (slug_db.type) {
                case SlugType.category:
                    console.log(!user?.id)
                    if (!user?.id) {
                        rs = { list: []}
                        break;
                    }
                    let [transactionCategory, category] = await Promise.all([
                        this.transactionService.find({ where: { user_id: user.id } }),
                        this.categoryService.findOne({ where: { slug_id: slug_db.id } })
                    ])
                    let category_ids = transactionCategory.map(item => item.category_id)
                    if(!category_ids.includes(category.id)) return
                    if (category.type == CategoryType.exam) {
                        if(!body) body = {}
                        if(!body?.filter) body.filter = {}
                        body.filter.category_ids = [category.id]
                        let { data } = await this.examService.getListExam(body)
                        rs = data
                    }

                    if (category.type == CategoryType.post) {
                        let { data } = await this.postService.listPost(body)
                        rs = data
                    }
                    break;
                case SlugType.exam:
                    let rs_get_exam = await this.examService.getExam(slug)
                    rs = rs_get_exam.data
                    break;
                case SlugType.post:
                    let { data } = await this.postService.getPost(slug)
                    rs = data
                    break;

                default:
                    break;
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
