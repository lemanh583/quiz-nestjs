import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { Slug } from 'src/slug/slug.entity';
import { Post } from 'src/post/post.entity';
import { CategoryType } from 'src/common/enum/category.enum';
import { ExamLangType } from 'src/common/enum/exam.enum';
import { Course } from 'src/course/course.entitty';
import { Transaction } from 'src/transaction/transaction.entity';

@Entity({ name: "categories"})
export class Category extends BaseEntity {
    @Column()
    title: string

    @Column({ default: false })
    hidden: boolean

    @Column({ type: "enum" , enum: CategoryType, default: null })
    type: CategoryType

    @Column({ type: "enum", enum: ExamLangType, default: ExamLangType.vi })
    lang_type: ExamLangType

    @OneToOne(() => Slug, { onDelete: "CASCADE"})
    @JoinColumn({ name: "slug_id"})
    slug: Slug

    @Column({ name: "slug_id" })
    slug_id: number

    @OneToMany(() => Post, (e) => e.category)
    posts: Post[]

    @OneToMany(() => Course, (e) => e.category)
    courses: Course[]

    @OneToMany(() => Transaction,(e) => e.category)
    transactions: Transaction[]
}