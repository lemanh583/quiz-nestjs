import { Module } from '@nestjs/common';
import { HistoryAnswerService } from './history-answer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryAnswer } from './history-answer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistoryAnswer])
  ],
  providers: [HistoryAnswerService],
  exports: [HistoryAnswerService]
})
export class HistoryAnswerModule { }
