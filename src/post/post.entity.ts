import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { Slug } from 'src/slug/slug.entity';
import { Category } from 'src/category/category.entity';
import { PostPosition } from 'src/common/enum/post.enum';

@Entity({ name: "posts" })
export class Post extends BaseEntity {
    @Column()
    title: string

    @Column()
    descriptions: string

    @Column()
    content: string

    @Column({ default: 0 })
    view: number

    @Column({ type: "enum", enum: PostPosition, default: null })
    position: PostPosition

    @Column({ name: "slug_id" })
    slug_id: number

    @Column({ name: "category_id" })
    category_id: number

    @OneToOne(() => Slug, { onDelete: "CASCADE"})
    @JoinColumn({ name: "slug_id" })
    slug: Slug

    @ManyToOne(() => Category, category => category.posts, { onDelete: "CASCADE"})
    @JoinColumn({ name: 'category_id' })
    category: Category;
}