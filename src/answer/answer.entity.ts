import { Entity, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { Question } from 'src/question/question.entity';
import { HistoryAnswer } from 'src/history-answer/history-answer.entity';

@Entity({ name: "answers" })
export class Answer extends BaseEntity {
    @Column({type: "longtext"})
    title: string

    @Column({ default: false })
    correct: boolean

    @Column()
    default_order: number

    @ManyToOne(() => Question, e => e.answers)
    @JoinColumn({ name: 'question_id' })
    question: Question;

    @Column({ name: 'question_id' })
    question_id: string
}