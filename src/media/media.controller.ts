import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation } from "@nestjs/swagger"
import { BaseListFilterDto } from 'src/common/base/base.list';
import { MediaService } from './media.service';
import { ResponseInterface } from 'src/common/interface';
@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService ) {}
    @ApiOperation({ summary: "list media" })
    @Post('/list')
    async listMedia(@Body() body: BaseListFilterDto<any, any>): Promise<ResponseInterface<any>> {
        try {
            let { error, data } = await this.mediaService.listMedia(body)
            if (error) {
                throw new HttpException(error, HttpStatus.BAD_REQUEST)
            }
            return {
                code: HttpStatus.OK,
                success: true,
                ...data
            }
        } catch (error) {
            console.error('/media/list', error)
            if (error instanceof HttpException) throw error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
