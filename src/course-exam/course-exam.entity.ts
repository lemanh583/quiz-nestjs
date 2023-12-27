import { Entity, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { Exam } from 'src/exam/exam.entity';
import { Question } from 'src/question/question.entity';
import { Category } from 'src/category/category.entity';
import { Course } from 'src/course/course.entitty';

@Entity({ name: "course_exams" })
export class CourseExam extends BaseEntity {
    @Column({ default: 0 })
    total: number
    
    // course
    @ManyToOne(() => Course, e => e.course_exams, { onDelete: "CASCADE"})
    @JoinColumn({ name: 'course_id' })
    course: Course;

    @Column({ name: "course_id" })
    course_id: number

    // exam
    @ManyToOne(() => Exam, e => e.course_exams, { onDelete: "CASCADE"})
    @JoinColumn({ name: 'exam_id' })
    exam: Exam;

    @Column({ name: "exam_id" })
    exam_id: number
}