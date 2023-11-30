import { Entity, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { Exam } from 'src/exam/exam.entity';
import { Answer } from 'src/answer/answer.entity';
import { HistoryAnswer } from 'src/history-answer/history-answer.entity';

@Entity({ name: "questions" })
export class Question extends BaseEntity {
    @Column()
    title: string

    @Column()
    type: string

    @ManyToOne(() => Exam, e => e.questions)
    @JoinColumn({ name: 'exam_id' })
    exam: Exam;

    @OneToMany(() => Answer, (e) => e.question)
    answers: Answer[]

    @OneToMany(() => HistoryAnswer, (e) => e.question)
    history_answers: HistoryAnswer[]
    
}