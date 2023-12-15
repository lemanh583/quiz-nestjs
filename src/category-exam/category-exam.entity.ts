import { Entity, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { Exam } from 'src/exam/exam.entity';
import { Question } from 'src/question/question.entity';
import { Category } from 'src/category/category.entity';

@Entity({ name: "category_exams" })
export class CategoryExam extends BaseEntity {

    @Column({ name: "category_id" })
    category_id: number
    
    @Column({ name: "exam_id" })
    exam_id: number

    @Column({ default: 0 })
    total: number
 
    @ManyToOne(() => Category, e => e.category_exams, { onDelete: "CASCADE"})
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @ManyToOne(() => Exam, e => e.category_exams, { onDelete: "CASCADE"})
    @JoinColumn({ name: 'exam_id' })
    exam: Exam;

}