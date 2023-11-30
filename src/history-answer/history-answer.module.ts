import { Module } from '@nestjs/common';
import { HistoryAnswerService } from './history-answer.service';

@Module({
  providers: [HistoryAnswerService]
})
export class HistoryAnswerModule {}
