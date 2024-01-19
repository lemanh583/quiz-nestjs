import { Module } from '@nestjs/common';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from './topic.entity';
import { ExamHistory } from 'src/exam-history/exam-history.entity';
import { Transaction } from 'src/transaction/transaction.entity';
import { Slug } from 'src/slug/slug.entity';
import { Exam } from 'src/exam/exam.entity';
import { Category } from 'src/category/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Topic, Transaction, Exam, ExamHistory, Slug, Category])
  ],
  controllers: [TopicController],
  providers: [TopicService],
  exports: [TopicService]
})
export class TopicModule {}
