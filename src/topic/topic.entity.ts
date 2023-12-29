import { Entity, Column, OneToOne, JoinColumn, OneToMany, AfterLoad, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { Slug } from 'src/slug/slug.entity';
import { Exam } from 'src/exam/exam.entity';
import { Post } from 'src/post/post.entity';
import { CategoryType } from 'src/common/enum/category.enum';
import { ExamLangType } from 'src/common/enum/exam.enum';
import { Transaction } from 'src/transaction/transaction.entity';
import { CategoryExam } from 'src/category-exam/category-exam.entity';
import { Category } from 'src/category/category.entity';
import { TopicType } from 'src/common/enum/topic.enum';

@Entity({ name: "topics"})
export class Topic extends BaseEntity {
    @Column()
    title: string

    @Column({ default: null })
    img: string

    @Column({ default: null })
    description: string

    @Column({ default: false })
    hidden: boolean

    @Column({ type: "enum" , enum: TopicType, default: TopicType.exam })
    type: TopicType

    @Column({ type: "enum", enum: ExamLangType, default: ExamLangType.vi })
    lang_type: ExamLangType

    @OneToOne(() => Slug, { onDelete: "CASCADE"})
    @JoinColumn({ name: "slug_id"})
    slug: Slug

    @Column({ name: "slug_id" })
    slug_id: number

    @OneToMany(() => Post, (e) => e.topic)
    posts: Post[]

    @OneToMany(() => Transaction, (e) => e.topic)
    transactions: Transaction[]

    // @OneToMany(() => Category, (e) => e.topic)
    // categories: Category[]
    @ManyToMany(() => Category, (e) => e.topics)
    @JoinTable()
    categories: Category[];

    @OneToMany(() => Exam, (e) => e.topic)
    exams: Exam[]
}