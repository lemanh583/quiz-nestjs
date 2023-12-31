import { Entity, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { Exam } from 'src/exam/exam.entity';
import { Question } from 'src/question/question.entity';

@Entity({ name: "exam_questions" })
export class ExamQuestion extends BaseEntity {

    @Column({ name: "question_id" })
    question_id: number
    
    @Column({ name: "exam_id" })
    exam_id: number
 
    @ManyToOne(() => Question, e => e.exam_questions, { onDelete: "CASCADE"})
    @JoinColumn({ name: 'question_id' })
    question: Question;

    @ManyToOne(() => Exam, e => e.exam_questions, { onDelete: "CASCADE"})
    @JoinColumn({ name: 'exam_id' })
    exam: Exam;

}