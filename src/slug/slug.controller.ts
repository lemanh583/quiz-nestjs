import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { SlugService } from './slug.service';

@Controller('')
export class SlugController {
    constructor(
        private readonly slugService: SlugService
    ){}

    @Get('/:slug') 
    async getDataFromSlug(@Param('slug') slug: string) {
        try {
            console.log('Slug', slug);
            let slugDB = await this.slugService.findOne({ where: { slug: slug } });
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
}
