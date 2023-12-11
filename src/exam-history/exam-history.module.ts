import { Module } from '@nestjs/common';
import { ExamHistoryService } from './exam-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamHistory } from './exam-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExamHistory])
  ],
  providers: [ExamHistoryService],
  exports: [ExamHistoryService]
})
export class ExamHistoryModule {}
