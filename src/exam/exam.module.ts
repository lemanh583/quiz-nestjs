import { Module, forwardRef } from '@nestjs/common';
import { ExamService } from './exam.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from './exam.entity';
import { ExamController } from './exam.controller';
import { MulterModule } from '@nestjs/platform-express';
import { UploadMiddleware } from 'src/middleware/upload.middleware';
import { SlugModule } from 'src/slug/slug.module';
import { CategoryModule } from 'src/category/category.module';
import { Question } from 'src/question/question.entity';
import { Answer } from 'src/answer/answer.entity';
import { ExamQuestion } from 'src/exam-question/exam-question.entity';
import { UserModule } from 'src/user/user.module';
import { ExamQuestionModule } from 'src/exam-question/exam-question.module';
import { ExamHistoryModule } from 'src/exam-history/exam-history.module';
import { HistoryAnswerModule } from 'src/history-answer/history-answer.module';
import { ExamHistory } from 'src/exam-history/exam-history.entity';
import { HistoryAnswer } from 'src/history-answer/history-answer.entity';
import { Category } from 'src/category/category.entity';
import { Slug } from 'src/slug/slug.entity';
import { User } from 'src/user/user.entity';
import { CategoryExam } from 'src/category-exam/category-exam.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Exam, 
      ExamQuestion, 
      ExamHistory, 
      HistoryAnswer, 
      Category, 
      Slug,
      User,
      CategoryExam
    ])
  ],
  controllers: [
    ExamController
  ],
  providers: [ExamService],
  exports: [ExamService]
})
export class ExamModule { }
