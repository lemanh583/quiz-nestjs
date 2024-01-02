import { Entity, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { ExamHistory } from 'src/exam-history/exam-history.entity';
import { ExamQuestion } from 'src/exam-question/exam-question.entity';
import { ExamLangType, ExamType } from 'src/common/enum/exam.enum';
import { User } from 'src/user/user.entity';
import { CategoryExam } from 'src/category-exam/category-exam.entity';
import { Topic } from 'src/topic/topic.entity';

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

    @Column({ default: null })
    time_start: Date

    @Column({ default: null })
    time_end: Date

    @Column({ type: "enum", enum: ExamType, default: ExamType.user })
    type: ExamType

    @Column({ type: "enum", enum: ExamLangType, default: ExamLangType.vi })
    lang_type: ExamLangType

    @Column({ default: null })
    describe: string

    // @Column({ unique: true })
    // slug: string
    // @OneToOne(() => Slug, { onDelete: "CASCADE", nullable: true})
    // @JoinColumn({ name: "slug_id" })
    // slug: Slug

    // @Column({ name: "slug_id" })
    // slug_id: number
    
    @ManyToOne(() => User, user => user.exams, { onDelete: "CASCADE", nullable: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: "user_id" })
    user_id: number

    // Lưu topic_id đối với những đề được user gen tự động
    @ManyToOne(() => Topic, user => user.exams, { onDelete: "CASCADE", nullable: true })
    @JoinColumn({ name: 'topic_id' })
    topic: Topic;

    @Column({ name: "topic_id", default: null })
    topic_id: number

    @OneToMany(() => ExamHistory, (e) => e.exam)
    exam_histories: ExamHistory[]

    @OneToMany(() => CategoryExam, (e) => e.exam)
    category_exams: CategoryExam[]

    @OneToMany(() => ExamQuestion, (e) => e.exam)
    exam_questions: ExamQuestion[]
}
