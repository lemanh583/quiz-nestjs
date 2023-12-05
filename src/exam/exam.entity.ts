import { Entity, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { Slug } from 'src/slug/slug.entity';
import { Category } from 'src/category/category.entity';
import { Question } from 'src/question/question.entity';
import { ExamHistory } from 'src/exam-history/exam-history.entity';
import { HistoryAnswer } from 'src/history-answer/history-answer.entity';
import { ExamQuestion } from 'src/exam-question/exam-question.entity';
import { ExamLangType, ExamType } from 'src/common/enum/exam.enum';

@Entity({ name: "exams" })
export class Exam extends BaseEntity {
    @Column()
    title: string

    @Column({ default: null })
    time_start: Date

    @Column({ default: null })
    time_end: Date

    @Column({ type: "enum", enum: ExamType, default: ExamType.user })
    type: ExamType

    @Column({ type: "enum", enum: ExamLangType, default: ExamLangType.vi })
    lang_type: ExamLangType

    @Column({ default: 60 })
    total_generate_question: number

    @OneToOne(() => Slug)
    @JoinColumn({ name: "slug_id" })
    slug: Slug

    @Column({ name: "slug_id" })
    slug_id: number
    
    @ManyToOne(() => Category, category => category.exams)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ name: "category_id" })
    category_id: number

    @OneToMany(() => ExamHistory, (e) => e.exam)
    exam_histories: ExamHistory[]

    @OneToMany(() => HistoryAnswer, (e) => e.exam)
    history_answers: HistoryAnswer[]

    @OneToMany(() => ExamQuestion, (e) => e.exam)
    exam_questions: ExamQuestion[]
}