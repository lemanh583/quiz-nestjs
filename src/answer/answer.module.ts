import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './answer.entity';
import { Question } from 'src/question/question.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Answer, Question])
  ],
  providers: [AnswerService],
  exports: [AnswerService]
})
export class AnswerModule {}
