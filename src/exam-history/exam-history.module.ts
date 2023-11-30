import { Module } from '@nestjs/common';
import { HistoryService } from './exam-history.service';

@Module({
  providers: [HistoryService]
})
export class HistoryModule {}
