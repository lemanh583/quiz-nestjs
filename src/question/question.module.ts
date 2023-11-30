import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './question.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Question])
    ],
    providers: [
        QuestionService
    ]
})
export class QuestionModule {}
