import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { Slug } from 'src/slug/slug.entity';
import { Category } from 'src/category/category.entity';

@Entity({ name: "posts" })
export class Post extends BaseEntity {
    @Column()
    title: string

    @Column()
    descriptions: string

    @Column()
    content: string

    @Column()
    view: number

    @OneToOne(() => Slug)
    @JoinColumn({ name: "slug_id" })
    slug: Slug

    @ManyToOne(() => Category, category => category.posts)
    @JoinColumn({ name: 'category_id' })
    category: Category;
}