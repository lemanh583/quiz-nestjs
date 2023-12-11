import { Module } from '@nestjs/common';
import { ExamQuestionService } from './exam-question.service';
import { ExamQuestionController } from './exam-question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamQuestion } from './exam-question.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExamQuestion])
  ],
  providers: [ExamQuestionService],
  controllers: [ExamQuestionController],
  exports: [ExamQuestionService]
})
export class ExamQuestionModule {}
