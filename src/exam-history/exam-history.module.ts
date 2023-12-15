import { Module } from '@nestjs/common';
import { ExamHistoryService } from './exam-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamHistory } from './exam-history.entity';
import { Exam } from 'src/exam/exam.entity';
import { ExamHistoryController } from './exam-history.controller';
import { HistoryAnswer } from 'src/history-answer/history-answer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExamHistory, Exam, HistoryAnswer])
  ],
  controllers: [ExamHistoryController],
  providers: [ExamHistoryService],
  exports: [ExamHistoryService]
})
export class ExamHistoryModule {}
