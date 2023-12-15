import { Entity, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { User } from 'src/user/user.entity';
import { Exam } from 'src/exam/exam.entity';
import { HistoryAnswer } from 'src/history-answer/history-answer.entity';

@Entity({ name: "exam_histories" })
export class ExamHistory extends BaseEntity {
    @Column({type: "float", default: 0 })
    score: number

    @Column({ default: 0 })
    total_correct_answer: number

    @Column({ default: null })
    start_time: Date

    @Column({ default: null })
    end_time: Date

    @Column({ name: 'user_id' })
    user_id: number
    
    @Column({ name: 'exam_id' })
    exam_id: number

    @ManyToOne(() => User, e => e.exam_histories, { onDelete: "CASCADE"})
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Exam, e => e.exam_histories, { onDelete: "CASCADE"})
    @JoinColumn({ name: 'exam_id' })
    exam: Exam;

    @OneToMany(() => HistoryAnswer, (e) => e.exam_history)
    history_answers: HistoryAnswer[]
}