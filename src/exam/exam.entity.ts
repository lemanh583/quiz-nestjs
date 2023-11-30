import { Entity, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { Slug } from 'src/slug/slug.entity';
import { Category } from 'src/category/category.entity';
import { Question } from 'src/question/question.entity';
import { ExamHistory } from 'src/exam-history/exam-history.entity';
import { HistoryAnswer } from 'src/history-answer/history-answer.entity';

@Entity({ name: "exams" })
export class Exam extends BaseEntity {
    @Column()
    title: string

    @OneToOne(() => Slug)
    @JoinColumn({ name: "slug_id" })
    slug: Slug

    @ManyToOne(() => Category, category => category.exams)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @OneToMany(() => Question, (e) => e.exam)
    questions: Question[]

    @OneToMany(() => ExamHistory, (e) => e.exam)
    exam_histories: ExamHistory[]

    @OneToMany(() => HistoryAnswer, (e) => e.exam)
    history_answers: HistoryAnswer[]
}