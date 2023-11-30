import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ExamService } from './exam.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('exam')
export class ExamController {
    constructor(private readonly examService: ExamService){}

    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadExam(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
        console.log('upload', file)
        console.log('hehe', file.path)
        let a = await this.examService.handleUploadExcel(file)
        return {
            a
        }
    }

}
