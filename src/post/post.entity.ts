import { Entity, Column, OneToOne, JoinColumn, ManyToOne, ManyToMany } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { Slug } from 'src/slug/slug.entity';
import { PostPosition } from 'src/common/enum/post.enum';
import { Topic } from 'src/topic/topic.entity';
import { Tag } from 'src/tag/tag.entity';

@Entity({ name: "posts" })
export class Post extends BaseEntity {
    @Column()
    title: string

    @Column()
    description: string

    @Column()
    content: string

    @Column({ default: null })
    img: string

    @Column({ default: 0 })
    view: number

    // slug
    @OneToOne(() => Slug, { onDelete: "CASCADE" })
    @JoinColumn({ name: "slug_id" })
    slug: Slug

    @Column({ name: "slug_id" })
    slug_id: number

    // topic
    @ManyToOne(() => Topic, t => t.posts, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'topic_id' })
    topic: Topic;

    @Column({ name: "topic_id" })
    topic_id: number

    // tag
    @ManyToMany(() => Tag, t => t.posts)
    tags: Tag[];
}