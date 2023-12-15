import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './question.entity';
import { Exam } from 'src/exam/exam.entity';
import { QuestionSubscriber } from './question.listener';
import { ExamQuestion } from 'src/exam-question/exam-question.entity';
import { Answer } from 'src/answer/answer.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Question, Exam, ExamQuestion, Answer])
    ],
    providers: [
        QuestionService,
        QuestionSubscriber
    ],
    exports: [QuestionService]
})
export class QuestionModule {}
