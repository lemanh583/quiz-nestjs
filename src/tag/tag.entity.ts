import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { Post } from 'src/post/post.entity';

@Entity({ name: "tags" })
export class Tag extends BaseEntity {
    @Column()
    title: string

    @Column({ unique: true })
    slug: string

    @ManyToMany(() => Post, (e) => e.tags)
    @JoinTable()
    posts: Post[];
}