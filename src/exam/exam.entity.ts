import { Entity, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { Slug } from 'src/slug/slug.entity';
import { Category } from 'src/category/category.entity';
import { Question } from 'src/question/question.entity';
import { ExamHistory } from 'src/exam-history/exam-history.entity';
import { HistoryAnswer } from 'src/history-answer/history-answer.entity';
import { ExamQuestion } from 'src/exam-question/exam-question.entity';
import { ExamLangType, ExamType } from 'src/common/enum/exam.enum';
import { User } from 'src/user/user.entity';

@Entity({ name: "exams" })
export class Exam extends BaseEntity {
    @Column()
    title: string

    @Column({ default: false })
    hidden: boolean

    @Column({ default: 0 })
    time_work_minutes: number

    @Column({ default: 1000 })
    total_work: number

    @Column({ default: 10 })
    score: number

    @Column({ type: "longtext", default: null })
    log_auto_category_id: string

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

    @ManyToOne(() => User, user => user.exams, {cascade: true,  onDelete: "CASCADE" })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: "user_id" })
    user_id: number

    @Column({ name: "category_id" })
    category_id: number

    @OneToMany(() => ExamHistory, (e) => e.exam)
    exam_histories: ExamHistory[]

    // @OneToMany(() => HistoryAnswer, (e) => e.exam)
    // history_answers: HistoryAnswer[]

    @OneToMany(() => ExamQuestion, (e) => e.exam)
    exam_questions: ExamQuestion[]
}
