import { Entity, Column, OneToOne, JoinColumn, OneToMany, AfterLoad, ManyToOne, ManyToMany } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { Slug } from 'src/slug/slug.entity';
import { CategoryType } from 'src/common/enum/category.enum';
import { ExamLangType } from 'src/common/enum/exam.enum';
import { CategoryExam } from 'src/category-exam/category-exam.entity';
import { Topic } from 'src/topic/topic.entity';

@Entity({ name: "categories"})
export class Category extends BaseEntity {
    @Column()
    title: string

    @Column({ default: false })
    hidden: boolean

    @Column({ type: "enum", enum: ExamLangType, default: ExamLangType.vi })
    lang_type: ExamLangType
    
    @Column({ unique: true })
    slug: string

    @OneToMany(() => CategoryExam, (e) => e.category)
    category_exams: CategoryExam[]

    @ManyToMany(() => Topic, (e) => e.categories)
    topics: Topic[];
}