import { Entity, Column, OneToOne, JoinColumn, OneToMany, AfterLoad } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { Slug } from 'src/slug/slug.entity';
import { Exam } from 'src/exam/exam.entity';
import { Post } from 'src/post/post.entity';

@Entity({ name: "categories"})
export class Category extends BaseEntity {
    @Column()
    title: string

    @Column()
    type: string

    @OneToOne(() => Slug)
    @JoinColumn({ name: "slug_id"})
    slug: Slug

    @Column({ name: "slug_id" })
    slug_id: string

    @OneToMany(() => Exam, (e) => e.category)
    exams: Exam[]

    @OneToMany(() => Post, (e) => e.category)
    posts: Post[]
}