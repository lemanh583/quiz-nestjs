import { Entity, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { ExamHistory } from 'src/exam-history/exam-history.entity';
import { ExamQuestion } from 'src/exam-question/exam-question.entity';
import { ExamLangType, ExamType } from 'src/common/enum/exam.enum';
import { User } from 'src/user/user.entity';
import { Course } from 'src/course/course.entitty';
import { CourseExam } from 'src/course-exam/course-exam.entity';

@Entity({ name: "exams" })
export class Exam extends BaseEntity {
    @Column()
    title: string

    @Column({ unique: true})
    slug: string

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

    @ManyToOne(() => User, user => user.exams, {cascade: true,  onDelete: "CASCADE", nullable: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: "user_id" })
    user_id: number

    @OneToMany(() => ExamHistory, (e) => e.exam)
    exam_histories: ExamHistory[]

    @OneToMany(() => CourseExam, (e) => e.exam)
    course_exams: CourseExam[]

    @OneToMany(() => ExamQuestion, (e) => e.exam)
    exam_questions: ExamQuestion[]
}
