import { Module } from '@nestjs/common';
import { ExamQuestionService } from './exam-question.service';
import { ExamQuestionController } from './exam-question.controller';

@Module({
  providers: [ExamQuestionService],
  controllers: [ExamQuestionController]
})
export class ExamQuestionModule {}
