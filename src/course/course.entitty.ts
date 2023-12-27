import { Entity, Column, OneToOne, JoinColumn, OneToMany, AfterLoad, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { Slug } from 'src/slug/slug.entity';
import { Exam } from 'src/exam/exam.entity';
import { ExamLangType } from 'src/common/enum/exam.enum';
import { Transaction } from 'src/transaction/transaction.entity';
import { Category } from 'src/category/category.entity';
import { CourseExam } from 'src/course-exam/course-exam.entity';

@Entity({ name: "courses"})
export class Course extends BaseEntity {
    @Column()
    title: string

    @Column({ default: false })
    hidden: boolean

    @Column({ type: "enum", enum: ExamLangType, default: ExamLangType.vi })
    lang_type: ExamLangType

    @Column({ default: 0 })
    price: boolean

    // slug
    @OneToOne(() => Slug, { onDelete: "CASCADE"})
    @JoinColumn({ name: "slug_id"})
    slug: Slug

    @Column({ name: "slug_id" })
    slug_id: number

    // category
    @ManyToOne(() => Category, e => e.courses , { onDelete: "CASCADE" })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ name: "category_id" })
    category_id: number

    // exam
    @OneToMany(() => CourseExam, (e) => e.course)
    course_exams: CourseExam[]
    
    // @OneToMany(() => Transaction, (e) => e.course)
    // transactions: Transaction[]
}