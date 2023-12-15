import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntitySubscriberInterface, InsertEvent, Repository } from 'typeorm';
import { Question } from './question.entity';
import { ExamQuestion } from 'src/exam-question/exam-question.entity';
import { Exam } from 'src/exam/exam.entity';

@Injectable()
export class QuestionSubscriber implements EntitySubscriberInterface {

    constructor(
        @InjectDataSource() readonly connection: DataSource,
        // Inject your repository here
        // @InjectRepository(Question)
        // private readonly repository: Repository<Question>,
        // @InjectRepository(ExamQuestion)
        // private readonly examQuestionRepository: Repository<ExamQuestion>,
    ) {
        connection.subscribers.push(this);
    }

    listenTo() {
        return Question;
    }

    beforeInsert(event: InsertEvent<Question>) {
        // called before insert
    };

    async afterInsert(event: InsertEvent<any>) {
        let { exam } = event.entity
        if (!(exam instanceof Exam)) return
        await event.manager.getRepository(ExamQuestion).insert({
            exam_id: exam.id,
            question: event.entity
        })
        delete event.entity.exam
    }

}