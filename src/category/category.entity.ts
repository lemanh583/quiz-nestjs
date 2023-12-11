import { Entity, Column, OneToOne, JoinColumn, OneToMany, AfterLoad } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { Slug } from 'src/slug/slug.entity';
import { Exam } from 'src/exam/exam.entity';
import { Post } from 'src/post/post.entity';
import { CategoryType } from 'src/common/enum/category.enum';
import { ExamLangType } from 'src/common/enum/exam.enum';

@Entity({ name: "categories"})
export class Category extends BaseEntity {
    @Column()
    title: string

    @Column({ default: false })
    hidden: boolean

    @Column({ type: "enum" , enum: CategoryType, default: CategoryType.exam })
    type: CategoryType

    @Column({ type: "enum", enum: ExamLangType, default: ExamLangType.vi })
    lang_type: ExamLangType

    @OneToOne(() => Slug)
    @JoinColumn({ name: "slug_id"})
    slug: Slug

    @Column({ name: "slug_id" })
    slug_id: number

    @OneToMany(() => Exam, (e) => e.category)
    exams: Exam[]

    @OneToMany(() => Post, (e) => e.category)
    posts: Post[]
}