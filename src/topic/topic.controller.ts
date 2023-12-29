import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { TopicService } from './topic.service';
import { BaseListFilterDto } from 'src/common/base/base.list';
import { ResponseInterface } from 'src/common/interface';
import { ApiOperation } from "@nestjs/swagger"

@Controller('topic')
export class TopicController {
    constructor(
        private readonly topicService: TopicService
    ) { }

    @ApiOperation({ summary: "list topic" })
    @Post('/list')
    async listTopic(@Body() body: BaseListFilterDto<any, any>): Promise<ResponseInterface<any>> {
        try {
            let { error, data } = await this.topicService.getListTopic(body)
            if (error) {
                throw new HttpException(error, HttpStatus.BAD_REQUEST)
            }
            return {
                code: HttpStatus.OK,
                success: true,
                ...data
            }
        } catch (error) {
            console.error('/admin/topic/list', error)
            if (error instanceof HttpException) throw error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
