import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { CategoryModule } from 'src/category/category.module';
import { ExamModule } from 'src/exam/exam.module';
import { MulterModule } from '@nestjs/platform-express';
import { UploadMiddleware } from 'src/middleware/upload.middleware';
import { QuestionModule } from 'src/question/question.module';
import { AnswerModule } from 'src/answer/answer.module';
import { TransactionModule } from 'src/transaction/transaction.module';
@Module({
  imports: [
    CategoryModule,
    ExamModule,
    QuestionModule,
    AnswerModule,
    TransactionModule,
    MulterModule.registerAsync({
      useClass: UploadMiddleware,
    })
  ],
  providers: [AdminService],
  controllers: [AdminController]
})
export class AdminModule {}
