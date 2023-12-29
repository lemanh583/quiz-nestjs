import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { PostService } from './post.service';
import { BaseListFilterDto } from 'src/common/base/base.list';
import { ResponseInterface } from 'src/common/interface';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService){}
    @Post('/list')
    async listPost(@Body() body: BaseListFilterDto<any, any>): Promise<ResponseInterface<any>> {
        try {
            let { error, data } = await this.postService.listPost(body)
            if (error) {
                throw new HttpException(error, HttpStatus.BAD_REQUEST)
            }
            return {
                code: HttpStatus.OK,
                success: true,
                ...data
            }
        } catch (error) {
            console.error('/post/list', error)
            if (error instanceof HttpException) throw error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
