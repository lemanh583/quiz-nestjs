import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { Exam } from 'src/exam/exam.entity';
import { Question } from 'src/question/question.entity';
import { ExamHistory } from 'src/exam-history/exam-history.entity';
import { Answer } from 'src/answer/answer.entity';

@Entity({ name: "history_answers" })
export class HistoryAnswer extends BaseEntity {
    @Column({ default: 0 })
    score: number

    @Column({ default: false })
    correct: boolean
    
    // array string id
    @Column()
    answer_ids: string

    // array string id
    // logs order question shuffle
    @Column()
    order_questions: string

    @ManyToOne(() => Question, e => e.history_answers)
    @JoinColumn({ name: 'question_id' })
    question: Question;

    @ManyToOne(() => Exam, e => e.history_answers)
    @JoinColumn({ name: 'exam_id' })
    exam: Exam;

    @ManyToOne(() => ExamHistory, e => e.history_answers)
    @JoinColumn({ name: 'exam_history_id' })
    exam_history: ExamHistory;
}