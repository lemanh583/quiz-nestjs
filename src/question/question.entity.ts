import { Entity, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { Exam } from 'src/exam/exam.entity';
import { Answer } from 'src/answer/answer.entity';
import { HistoryAnswer } from 'src/history-answer/history-answer.entity';
import { ExamQuestion } from 'src/exam-question/exam-question.entity';
import { QuestionType } from 'src/common/enum/question.enum';

@Entity({ name: "questions" })
export class Question extends BaseEntity {
    @Column({type: "longtext"})
    title: string

    @Column({type: "longtext", default: null})
    recommend: string

    @Column({ type: "enum", enum: QuestionType, default: QuestionType.single })
    type: QuestionType

    @OneToMany(() => ExamQuestion, (e) => e.question)
    exam_questions: ExamQuestion[]

    @OneToMany(() => Answer, (e) => e.question)
    answers: Answer[]

    @OneToMany(() => HistoryAnswer, (e) => e.question)
    history_answers: HistoryAnswer[]
}